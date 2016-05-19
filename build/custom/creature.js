/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.2.2
 */

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


(function(_global) {
  "use strict";

  var shim = {};
  if (typeof(exports) === 'undefined') {
    if(typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
      shim.exports = {};
      define(function() {
        return shim.exports;
      });
    } else {
      // gl-matrix lives in a browser, define its namespaces in global
      shim.exports = typeof(window) !== 'undefined' ? window : _global;
    }
  }
  else {
    // gl-matrix lives in commonjs, define its namespaces in exports
    shim.exports = exports;
  }

  (function(exports) {
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

if(!GLMAT_RANDOM) {
    var GLMAT_RANDOM = Math.random;
}

/**
 * @class Common utilities
 * @name glMatrix
 */
var glMatrix = {};

/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
glMatrix.setMatrixArrayType = function(type) {
    GLMAT_ARRAY_TYPE = type;
}

if(typeof(exports) !== 'undefined') {
    exports.glMatrix = glMatrix;
}

var degree = Math.PI / 180;

/**
* Convert Degree To Radian
*
* @param {Number} Angle in Degrees
*/
glMatrix.toRadian = function(a){
     return a * degree;
}
;
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
 * Subtracts vector b from vector a
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
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
vec2.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
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
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to invert
 * @returns {vec2} out
 */
vec2.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
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
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
vec2.random = function (out, scale) {
    scale = scale || 1.0;
    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    out[0] = Math.cos(r) * scale;
    out[1] = Math.sin(r) * scale;
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
;
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
 * @class 3 Dimensional Vector
 * @name vec3
 */

var vec3 = {};

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
vec3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
};

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
vec3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
vec3.fromValues = function(x, y, z) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
vec3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
vec3.set = function(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
};

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
vec3.sub = vec3.subtract;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
};

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
vec3.mul = vec3.multiply;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
};

/**
 * Alias for {@link vec3.divide}
 * @function
 */
vec3.div = vec3.divide;

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
vec3.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
};

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
vec3.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
vec3.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.distance}
 * @function
 */
vec3.dist = vec3.distance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec3.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
vec3.sqrDist = vec3.squaredDistance;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
vec3.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.length}
 * @function
 */
vec3.len = vec3.length;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec3.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
vec3.sqrLen = vec3.squaredLength;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
vec3.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
};

/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */
vec3.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
};

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
vec3.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
vec3.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.cross = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
vec3.random = function (out, scale) {
    scale = scale || 1.0;

    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    var z = (GLMAT_RANDOM() * 2.0) - 1.0;
    var zScale = Math.sqrt(1.0-z*z) * scale;

    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2],
        w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1.0;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
};

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat3 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
};

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
vec3.transformQuat = function(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateX = function(out, a, b, c){
   var p = [], r=[];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[0];
	  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
	  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

  	return out;
};

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateY = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
  	r[1] = p[1];
  	r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateZ = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
  	r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
  	r[2] = p[2];
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec3.forEach = (function() {
    var vec = vec3.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 3;
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
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec3.str = function (a) {
    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec3 = vec3;
}
;
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
 * @class 4 Dimensional Vector
 * @name vec4
 */

var vec4 = {};

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
vec4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
};

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
vec4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
vec4.fromValues = function(x, y, z, w) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
vec4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
vec4.set = function(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
vec4.sub = vec4.subtract;

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
};

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
vec4.mul = vec4.multiply;

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
};

/**
 * Alias for {@link vec4.divide}
 * @function
 */
vec4.div = vec4.divide;

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
};

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
};

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
vec4.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
vec4.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
vec4.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.distance}
 * @function
 */
vec4.dist = vec4.distance;

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec4.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
vec4.sqrDist = vec4.squaredDistance;

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
vec4.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.length}
 * @function
 */
vec4.len = vec4.length;

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec4.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
vec4.sqrLen = vec4.squaredLength;

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
vec4.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
};

/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */
vec4.inverse = function(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
};

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
vec4.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    var len = x*x + y*y + z*z + w*w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
        out[3] = a[3] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
vec4.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
vec4.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
vec4.random = function (out, scale) {
    scale = scale || 1.0;

    //TODO: This is a pretty awful way of doing this. Find something better.
    out[0] = GLMAT_RANDOM();
    out[1] = GLMAT_RANDOM();
    out[2] = GLMAT_RANDOM();
    out[3] = GLMAT_RANDOM();
    vec4.normalize(out, out);
    vec4.scale(out, out, scale);
    return out;
};

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
vec4.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
};

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
vec4.transformQuat = function(out, a, q) {
    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec4.forEach = (function() {
    var vec = vec4.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 4;
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
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec4.str = function (a) {
    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec4 = vec4;
}
;
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
 * @class 2x2 Matrix
 * @name mat2
 */

var mat2 = {};

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
mat2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
mat2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
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
 * Calculates the adjugate of a mat2
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
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
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
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    return out;
};

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
mat2.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
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

/**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
};

/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {mat2} L the lower triangular matrix 
 * @param {mat2} D the diagonal matrix 
 * @param {mat2} U the upper triangular matrix 
 * @param {mat2} a the input matrix to factorize
 */

mat2.LDU = function (L, D, U, a) { 
    L[2] = a[2]/a[0]; 
    U[0] = a[0]; 
    U[1] = a[1]; 
    U[3] = a[3] - L[2] * U[1]; 
    return [L, D, U];       
}; 

if(typeof(exports) !== 'undefined') {
    exports.mat2 = mat2;
}
;
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
 * @class 2x3 Matrix
 * @name mat2d
 * 
 * @description 
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */

var mat2d = {};

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.create = function() {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
mat2d.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.invert = function(out, a) {
    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
        atx = a[4], aty = a[5];

    var det = aa * ad - ab * ac;
    if(!det){
        return null;
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
};

/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */
mat2d.determinant = function (a) {
    return a[0] * a[3] - a[1] * a[2];
};

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
    out[0] = a0 * b0 + a2 * b1;
    out[1] = a1 * b0 + a3 * b1;
    out[2] = a0 * b2 + a2 * b3;
    out[3] = a1 * b2 + a3 * b3;
    out[4] = a0 * b4 + a2 * b5 + a4;
    out[5] = a1 * b4 + a3 * b5 + a5;
    return out;
};

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
mat2d.mul = mat2d.multiply;


/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a2 * s;
    out[1] = a1 *  c + a3 * s;
    out[2] = a0 * -s + a2 * c;
    out[3] = a1 * -s + a3 * c;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
mat2d.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v0;
    out[2] = a2 * v1;
    out[3] = a3 * v1;
    out[4] = a4;
    out[5] = a5;
    return out;
};

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
mat2d.translate = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5],
        v0 = v[0], v1 = v[1];
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = a0 * v0 + a2 * v1 + a4;
    out[5] = a1 * v0 + a3 * v1 + a5;
    return out;
};

/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2d.str = function (a) {
    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ')';
};

/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {mat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat2d.frob = function (a) { 
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1))
}; 

if(typeof(exports) !== 'undefined') {
    exports.mat2d = mat2d;
}
;
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
 * @class 3x3 Matrix
 * @name mat3
 */

var mat3 = {};

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
mat3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
mat3.fromMat4 = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
};

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
mat3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
mat3.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
    } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
    }
    
    return out;
};

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,

        // Calculate the determinant
        det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
};

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    out[0] = (a11 * a22 - a12 * a21);
    out[1] = (a02 * a21 - a01 * a22);
    out[2] = (a01 * a12 - a02 * a11);
    out[3] = (a12 * a20 - a10 * a22);
    out[4] = (a00 * a22 - a02 * a20);
    out[5] = (a02 * a10 - a00 * a12);
    out[6] = (a10 * a21 - a11 * a20);
    out[7] = (a01 * a20 - a00 * a21);
    out[8] = (a00 * a11 - a01 * a10);
    return out;
};

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
mat3.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
};

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b00 = b[0], b01 = b[1], b02 = b[2],
        b10 = b[3], b11 = b[4], b12 = b[5],
        b20 = b[6], b21 = b[7], b22 = b[8];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;

    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;

    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
};

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
mat3.mul = mat3.multiply;

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
mat3.translate = function(out, a, v) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],
        x = v[0], y = v[1];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;

    out[3] = a10;
    out[4] = a11;
    out[5] = a12;

    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
};

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.rotate = function (out, a, rad) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        s = Math.sin(rad),
        c = Math.cos(rad);

    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;

    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;

    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
mat3.scale = function(out, a, v) {
    var x = v[0], y = v[1];

    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];

    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];

    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
mat3.fromMat2d = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;

    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;

    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
};

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
mat3.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;

    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;

    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;

    return out;
};

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
mat3.normalFromMat4 = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
};

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat3.str = function (a) {
    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + 
                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
};

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat3.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
};


if(typeof(exports) !== 'undefined') {
    exports.mat3 = mat3;
}
;
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
 * @class 4x4 Matrix
 * @name mat4
 */

var mat4 = {};

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    
    return out;
};

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
mat4.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < GLMAT_EPSILON) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateX = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateY = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateZ = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslation = function (out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};

mat4.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < GLMAT_EPSILON &&
        Math.abs(eyey - centery) < GLMAT_EPSILON &&
        Math.abs(eyez - centerz) < GLMAT_EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
mat4.frob = function (a) {
    return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
};


if(typeof(exports) !== 'undefined') {
    exports.mat4 = mat4;
}
;
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
 * @class Quaternion
 * @name quat
 */

var quat = {};

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
quat.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
quat.rotationTo = (function() {
    var tmpvec3 = vec3.create();
    var xUnitVec3 = vec3.fromValues(1,0,0);
    var yUnitVec3 = vec3.fromValues(0,1,0);

    return function(out, a, b) {
        var dot = vec3.dot(a, b);
        if (dot < -0.999999) {
            vec3.cross(tmpvec3, xUnitVec3, a);
            if (vec3.length(tmpvec3) < 0.000001)
                vec3.cross(tmpvec3, yUnitVec3, a);
            vec3.normalize(tmpvec3, tmpvec3);
            quat.setAxisAngle(out, tmpvec3, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        } else {
            vec3.cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot;
            return quat.normalize(out, out);
        }
    };
})();

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
quat.setAxes = (function() {
    var matr = mat3.create();

    return function(out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];

        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];

        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];

        return quat.normalize(out, quat.fromMat3(out, matr));
    };
})();

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
quat.clone = vec4.clone;

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
quat.fromValues = vec4.fromValues;

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
quat.copy = vec4.copy;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
quat.set = vec4.set;

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
quat.identity = function(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
quat.setAxisAngle = function(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
};

/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
quat.add = vec4.add;

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
quat.multiply = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
};

/**
 * Alias for {@link quat.multiply}
 * @function
 */
quat.mul = quat.multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
quat.scale = vec4.scale;

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateX = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateY = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        by = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateZ = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bz = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
};

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
quat.calculateW = function (out, a) {
    var x = a[0], y = a[1], z = a[2];

    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
};

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
quat.dot = vec4.dot;

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
quat.lerp = vec4.lerp;

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
quat.slerp = function (out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    var        omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if ( cosom < 0.0 ) {
        cosom = -cosom;
        bx = - bx;
        by = - by;
        bz = - bz;
        bw = - bw;
    }
    // calculate coefficients
    if ( (1.0 - cosom) > 0.000001 ) {
        // standard case (slerp)
        omega  = Math.acos(cosom);
        sinom  = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {        
        // "from" and "to" quaternions are very close 
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    
    return out;
};

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
quat.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
        invDot = dot ? 1.0/dot : 0;
    
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out[0] = -a0*invDot;
    out[1] = -a1*invDot;
    out[2] = -a2*invDot;
    out[3] = a3*invDot;
    return out;
};

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
quat.conjugate = function (out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
};

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 * @function
 */
quat.length = vec4.length;

/**
 * Alias for {@link quat.length}
 * @function
 */
quat.len = quat.length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
quat.squaredLength = vec4.squaredLength;

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
quat.sqrLen = quat.squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
quat.normalize = vec4.normalize;

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
quat.fromMat3 = function(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if ( fTrace > 0.0 ) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0);  // 2w
        out[3] = 0.5 * fRoot;
        fRoot = 0.5/fRoot;  // 1/(4w)
        out[0] = (m[5]-m[7])*fRoot;
        out[1] = (m[6]-m[2])*fRoot;
        out[2] = (m[1]-m[3])*fRoot;
    } else {
        // |w| <= 1/2
        var i = 0;
        if ( m[4] > m[0] )
          i = 1;
        if ( m[8] > m[i*3+i] )
          i = 2;
        var j = (i+1)%3;
        var k = (i+2)%3;
        
        fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[j*3+k] - m[k*3+j]) * fRoot;
        out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
        out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
    }
    
    return out;
};

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
quat.str = function (a) {
    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.quat = quat;
}
;













  })(shim.exports);
})(this);

/******************************************************************************
 * Creature Runtimes License
 * 
 * Copyright (c) 2015, Kestrel Moon Studios
 * All rights reserved.
 * 
 * Preamble: This Agreement governs the relationship between Licensee and Kestrel Moon Studios(Hereinafter: Licensor).
 * This Agreement sets the terms, rights, restrictions and obligations on using [Creature Runtimes] (hereinafter: The Software) created and owned by Licensor,
 * as detailed herein:
 * License Grant: Licensor hereby grants Licensee a Sublicensable, Non-assignable & non-transferable, Commercial, Royalty free,
 * Including the rights to create but not distribute derivative works, Non-exclusive license, all with accordance with the terms set forth and
 * other legal restrictions set forth in 3rd party software used while running Software.
 * Limited: Licensee may use Software for the purpose of:
 * Running Software on Licensee’s Website[s] and Server[s];
 * Allowing 3rd Parties to run Software on Licensee’s Website[s] and Server[s];
 * Publishing Software’s output to Licensee and 3rd Parties;
 * Distribute verbatim copies of Software’s output (including compiled binaries);
 * Modify Software to suit Licensee’s needs and specifications.
 * Binary Restricted: Licensee may sublicense Software as a part of a larger work containing more than Software,
 * distributed solely in Object or Binary form under a personal, non-sublicensable, limited license. Such redistribution shall be limited to unlimited codebases.
 * Non Assignable & Non-Transferable: Licensee may not assign or transfer his rights and duties under this license.
 * Commercial, Royalty Free: Licensee may use Software for any purpose, including paid-services, without any royalties
 * Including the Right to Create Derivative Works: Licensee may create derivative works based on Software, 
 * including amending Software’s source code, modifying it, integrating it into a larger work or removing portions of Software, 
 * as long as no distribution of the derivative works is made
 * 
 * THE RUNTIMES IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE RUNTIMES OR THE USE OR OTHER DEALINGS IN THE
 * RUNTIMES.
 *****************************************************************************/


// dualQuat

var Q_X = 0;
var Q_Y = 1;
var Q_Z = 2;
var Q_W = 3;

function dualQuat()
{
	this.real = quat.create();
	this.real[Q_W] = 0;
	
	this.imaginary = quat.create();
	this.imaginary[Q_W] = 0;
	
	this.tmpQ1 = quat.create();
};

dualQuat.prototype.reset = function()
{
  quat.identity(this.real);
  this.real[Q_W] = 0;
  quat.identity(this.imaginary);
  this.imaginary[Q_W] = 0;
  quat.identity(this.tmpQ1);
};

dualQuat.prototype.createFromData = function(q0, t)
{
	this.real = q0;
	this.imaginary = quat.create();
	this.imaginary[Q_W] = -0.5 * ( t[Q_X] * q0[Q_X] + t[Q_Y] * q0[Q_Y] + t[Q_Z] * q0[Q_Z]);
    this.imaginary[Q_X] =  0.5 * ( t[Q_X] * q0[Q_W] + t[Q_Y] * q0[Q_Z] - t[Q_Z] * q0[Q_Y]);
    this.imaginary[Q_Y] =  0.5 * (-t[Q_X] * q0[Q_Z] + t[Q_Y] * q0[Q_W] + t[Q_Z] * q0[Q_X]);
    this.imaginary[Q_Z] =  0.5 * ( t[Q_X] * q0[Q_Y] - t[Q_Y] * q0[Q_X] + t[Q_Z] * q0[Q_W]); 
    
};

dualQuat.prototype.add = function(quat_in, real_factor, imaginary_factor)
{
	//real = real.add((quat_in.real.cpy().mul(real_factor)));
	//var tmpQ = quat.clone(quat_in.real);
	quat.copy(this.tmpQ1, quat_in.real);
	
	quat.scale(this.tmpQ1, this.tmpQ1, real_factor);
	quat.add(this.real, this.tmpQ1, this.real);
	
    //imaginary = imaginary.add(quat_in.imaginary.cpy().mul(imaginary_factor));
    //tmpQ = quat.clone(quat_in.imaginary);
  quat.copy(this.tmpQ1, quat_in.imaginary);
  quat.scale(this.tmpQ1, this.tmpQ1, imaginary_factor);
	quat.add(this.imaginary, this.tmpQ1, this.imaginary);
};

dualQuat.prototype.normalize = function()
{
	var norm = quat.length(this.real);
	
	this.real = quat.scale(this.real, this.real, 1.0 / norm);
	this.imaginary = quat.scale(this.imaginary, this.imaginary, 1.0 / norm);
};

var v0 = vec3.create();
var ve = vec3.create();
var trans = vec3.create();
var tmpVec1 = vec3.create();
var tmpVec2 = vec3.create();
var tmpVec0 = vec3.create();
var aVec = vec3.create();
var rot = vec3.create();

dualQuat.prototype.transform = function(p)
{
        v0[Q_X] = this.real[Q_X]; v0[Q_Y] = this.real[Q_Y]; v0[Q_Z] = this.real[Q_Z];

        ve[Q_X] = this.imaginary[Q_X]; ve[Q_Y] = this.imaginary[Q_Y]; ve[Q_Z] = this.imaginary[Q_Z];

        //trans = (ve*real.w - v0*imaginary.w + Vector3.Cross(v0, ve)) * 2.0f;

//        var tmpVec1 = v0.cpy().scl((float)imaginary.w);
        tmpVec1 = vec3.scale(tmpVec1, v0, this.imaginary[Q_W]);
        
//        var tmpVec2 = v0.cpy().crs(ve);
		tmpVec2 = vec3.cross(tmpVec2, v0, ve);
        
        //var tmpVec0 = ve.cpy().scl(real.w);
        //trans = tmpVec0.sub(tmpVec1).add(tmpVec2);
        //trans.scl(2.0f);
        
        tmpVec0 = vec3.scale(tmpVec0, ve, this.real[Q_W]);
        
        aVec = vec3.subtract(aVec, tmpVec0, tmpVec1);
        trans = vec3.add(trans, aVec, tmpVec2);
        trans = vec3.scale(trans, trans, 2.0);

        //var rot = real.transform(p.cpy());
        rot = vec3.transformQuat(rot, p, this.real);

        //return rot.add(trans);
        rot = vec3.add(rot, rot, trans);
        
        return rot;
};

// Utils
var Utils = {};

Utils.setAxisMatrix = function(xAxis, yAxis, zAxis)
{
	var retMat = mat4.create();
	
	var M00 = 0;
	var M01 = 4;
	var M02 = 8;
	var M03 = 12;
	var M10 = 1;
	var M11 = 5;
	var M12 = 9;
	var M13 = 13;
	var M20 = 2;
	var M21 = 6;
	var M22 = 10;
	var M23 = 14;
	var M30 = 3;
	var M31 = 7;
	var M32 = 11;
	var M33 = 15;
	
	retMat[M00] = xAxis[Q_X];
	retMat[M01] = xAxis[Q_Y];
	retMat[M02] = xAxis[Q_Z];
	retMat[M10] = yAxis[Q_X];
	retMat[M11] = yAxis[Q_Y];
	retMat[M12] = yAxis[Q_Z];
	retMat[M20] = zAxis[Q_X];
	retMat[M21] = zAxis[Q_Y];
	retMat[M22] = zAxis[Q_Z];
	retMat[M03] = 0;
	retMat[M13] = 0;
	retMat[M23] = 0;
	retMat[M30] = 0;
	retMat[M31] = 0;
	retMat[M32] = 0;
	retMat[M33] = 1;
	
	retMat = mat4.transpose(retMat, retMat);
	
	return retMat;
};

Utils.matrixToQuat = function(mat_in)
{
	var retQuat = quat.create();
	var te = mat_in,

    m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
    m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
    m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

    trace = m11 + m22 + m33,
    s;

	if ( trace > 0 ) {

  		s = 0.5 / Math.sqrt( trace + 1.0 );

  		retQuat[Q_W] = 0.25 / s;
  		retQuat[Q_X] = ( m32 - m23 ) * s;
  		retQuat[Q_Y] = ( m13 - m31 ) * s;
  		retQuat[Q_Z] = ( m21 - m12 ) * s;

	} else if ( m11 > m22 && m11 > m33 ) {

  		s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

  		retQuat[Q_W] = ( m32 - m23 ) / s;
  		retQuat[Q_X] = 0.25 * s;
  		retQuat[Q_Y] = ( m12 + m21 ) / s;
		retQuat[Q_Z] = ( m13 + m31 ) / s;

	} else if ( m22 > m33 ) {

  		s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

	  	retQuat[Q_W] = ( m13 - m31 ) / s;
	  	retQuat[Q_X] = ( m12 + m21 ) / s;
	  	retQuat[Q_Y] = 0.25 * s;
	  	retQuat[Q_Z] = ( m23 + m32 ) / s;

	} else {

  		s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

  		retQuat[Q_W] = ( m21 - m12 ) / s;
  		retQuat[Q_X] = ( m13 + m31 ) / s;
  		retQuat[Q_Y] = ( m23 + m32 ) / s;
  		retQuat[Q_Z] = 0.25 * s;

	}	
	
	return retQuat;
};

Utils.rotateVec_90 = function(vec_in)
{
	var ret_vec = vec3.fromValues(-vec_in[Q_Y], vec_in[Q_X], vec_in[Q_Z]);
	
	return ret_vec;
};

Utils.calcRotateMat = function(vec_in)
{
	var dir = vec3.clone(vec_in);
	dir = vec3.normalize(dir, dir);
	
	var pep_dir = Utils.rotateVec_90(dir);
	
	var cur_tangent = vec3.fromValues(dir[Q_X], dir[Q_Y], 0);
	var cur_normal = vec3.fromValues(pep_dir[Q_X], pep_dir[Q_Y], 0);
	var cur_binormal = vec3.fromValues(0, 0, 1);
	
	var cur_rotate = mat4.create();
	cur_rotate = Utils.setAxisMatrix(cur_tangent, cur_normal, cur_binormal);
	
	return cur_rotate;
};

Utils.getMatTranslate = function(mat_in)
{
	var ret_pos = vec3.create();
	ret_pos[Q_X] = mat_in[12];
	ret_pos[Q_Y] = mat_in[13];
	ret_pos[Q_Z] = mat_in[14];
	
	return ret_pos;
};

Utils.addMat = function(mat1, mat2)
{
	var retMat = mat4.create();
	for(var i = 0; i < 16; i++)
	{
		retMat[i] = mat1[i] + mat2[i];
	}
	
	return retMat;
};

Utils.mulMat = function(mat_in, factor)
{
	var retMat = mat4.create();
	for(var i = 0; i < 16; i++)
	{
		retMat[i] = mat_in[i] * factor;	
	}
	
	return retMat;
};

Utils.clamp = function(num, min, max) {
    return num < min ? min : (num > max ? max : num);
};

  var newVec1 = vec3.create();
  var newVec2 = vec3.create();

Utils.vecInterp = function(vec1, vec2, ratio)
{
	newVec1 = vec3.scale(newVec1, vec1, 1.0 - ratio);
	newVec2 = vec3.scale(newVec2, vec2, ratio);
	
	var retVec = vec3.create();
	retVec = vec3.add(retVec, newVec1, newVec2);
	
	return retVec;
};

Utils.vec2Interp = function(vec_1, vec_2, ratio)
{
	var newVec1 = vec2.create();
	var newVec2 = vec2.create();
	
	newVec1 = vec2.scale(newVec1, vec_1, 1.0 - ratio);
	newVec2 = vec2.scale(newVec2, vec_2, ratio);
	
	var retVec = vec2.create();
	retVec = vec2.add(retVec, newVec1, newVec2);
	
	return retVec;
};

// MeshBone
function MeshBone(key_in, start_pt_in, end_pt_in, parent_transform)
{
	this.key = key_in;
	this.world_rest_angle = 0;
    this.rest_parent_mat = mat4.create();
    this.rest_parent_inv_mat = mat4.create();
    this.rest_world_mat = mat4.create();
    this.rest_world_inv_mat = mat4.create();
    this.bind_world_mat = mat4.create();
    this.bind_world_inv_mat = mat4.create();
    this.parent_world_mat = mat4.create();
    this.parent_world_inv_mat = mat4.create();
    this.local_rest_start_pt = null;
    this.local_rest_end_pt = null;

    this.setRestParentMat(parent_transform, null);
    this.setLocalRestStartPt(start_pt_in);
    this.setLocalRestEndPt(end_pt_in);
    this.setParentWorldInvMat(mat4.create());
    this.setParentWorldMat(mat4.create());
    
    this.local_binormal_dir = vec3.fromValues(0.0,0.0,1.0);
    this.tag_id = 0;
    
    this.children = [];
};

MeshBone.prototype.setRestParentMat = function(transform_in, inverse_in)
{
	this.rest_parent_mat = transform_in;
        if(inverse_in == null) {
            this.rest_parent_inv_mat = mat4.clone(this.rest_parent_mat);
            //rest_parent_inv_mat.inv();
            mat4.invert(this.rest_parent_inv_mat, this.rest_parent_inv_mat);
        }
        else {
            this.rest_parent_inv_mat = mat4.clone(inverse_in);
        }
};

MeshBone.prototype.setParentWorldMat = function(transform_in)
{
  this.parent_world_mat = transform_in;
};

MeshBone.prototype.setParentWorldInvMat = function(transform_in)
{
  this.parent_world_inv_mat = transform_in;
};

MeshBone.prototype.getLocalRestStartPt = function()
{
  return this.local_rest_start_pt;
};

MeshBone.prototype.getLocalRestEndPt = function()
{
  return this.local_rest_end_pt;
};

MeshBone.prototype.setLocalRestStartPt = function(world_pt_in)
{
  //local_rest_start_pt = Vector3.Transform(world_pt_in, rest_parent_inv_mat);
  //this.local_rest_start_pt = world_pt_in.cpy().traMul(rest_parent_inv_mat);
  this.local_rest_start_pt = vec3.create();
  this.local_rest_start_pt = vec3.transformMat4(this.local_rest_start_pt, world_pt_in, this.rest_parent_inv_mat);
  this.calcRestData();
};

MeshBone.prototype.setLocalRestEndPt = function(world_pt_in)
{
  //local_rest_end_pt = Vector3.Transform(world_pt_in, rest_parent_inv_mat);
  //this.local_rest_end_pt = world_pt_in.cpy().traMul(rest_parent_inv_mat);
  this.local_rest_end_pt = vec3.create();
  this.local_rest_end_pt = vec3.transformMat4(this.local_rest_end_pt, world_pt_in, this.rest_parent_inv_mat);
  this.calcRestData();
};

MeshBone.prototype.calcRestData = function()
{
  if(this.local_rest_start_pt == null || this.local_rest_end_pt == null)
  {
    return;
  }

  var calc = this.computeDirs(this.local_rest_start_pt, this.local_rest_end_pt);

  this.local_rest_dir = calc.first;
  this.local_rest_normal_dir = calc.second;

  this.computeRestLength();
};

MeshBone.prototype.setWorldStartPt = function(world_pt_in)
{
  this.world_start_pt = world_pt_in;
};

MeshBone.prototype.setWorldEndPt = function(world_pt_in)
{
  this.world_end_pt = world_pt_in;
};

MeshBone.prototype.fixDQs = function(ref_dq)
{
  //        if( Quaternion.Dot(world_dq.real, ref_dq.real) < 0) {
  //if( world_dq.real.dot(ref_dq.real) < 0) {
  if(quat.dot(this.world_dq.real, ref_dq.real) < 0) {
    //this.world_dq.real = world_dq.real.cpy().mul(-1);
    this.world_dq.real = quat.scale(this.world_dq.real, this.world_dq.real, -1);
    //this.world_dq.imaginary = world_dq.imaginary.cpy().mul(-1);
    this.world_dq.imaginary = quat.scale(this.world_dq.imaginary, this.world_dq.imaginary, -1);
  }

  for(var i = 0; i < this.children.length; i++) {
    var cur_child = this.children[i];
    cur_child.fixDQs(this.world_dq);
  }
};

MeshBone.prototype.initWorldPts = function()
{
  this.setWorldStartPt(this.getWorldRestStartPt());
  this.setWorldEndPt(this.getWorldRestEndPt());

  for(var i = 0; i < this.children.length; i++) {
    this.children[i].initWorldPts();
  }
};

MeshBone.prototype.getWorldRestStartPt = function()
{
  //Vector3 ret_vec = Vector3.Transform(local_rest_start_pt, rest_parent_mat);
  var tmp_mat = this.rest_parent_mat;
  var ret_vec = vec3.create();
  ret_vec = vec3.transformMat4(ret_vec, this.local_rest_start_pt, tmp_mat);

  return ret_vec;
};

MeshBone.prototype.getWorldRestEndPt = function()
{
  //        Vector3 ret_vec = Vector3.Transform(local_rest_end_pt, rest_parent_mat);
  var tmp_mat = this.rest_parent_mat;
  var ret_vec = vec3.create();
  ret_vec = vec3.transformMat4(ret_vec, this.local_rest_end_pt, tmp_mat);

  return ret_vec;
};

MeshBone.prototype.getWorldRestAngle = function()
{
  return this.world_rest_angle;
};

MeshBone.prototype.getWorldRestPos = function()
{
  return this.world_rest_pos;
};

MeshBone.prototype.getWorldStartPt = function()
{
  return this.world_start_pt;
};

MeshBone.prototype.getWorldEndPt = function()
{
  return this.world_end_pt;
};

MeshBone.prototype.getRestParentMat = function()
{
  return this.rest_parent_mat;
};

MeshBone.prototype.getRestWorldMat = function()
{
  return this.rest_world_mat;
};

MeshBone.prototype.getWorldDeltaMat = function()
{
  return this.world_delta_mat;
};

MeshBone.prototype.getParentWorldMat = function()
{
  return this.parent_world_mat;
};

MeshBone.prototype.getParentWorldInvMat = function()
{
  return this.parent_world_inv_mat;
};

MeshBone.prototype.getWorldDq = function()
{
  return this.world_dq;
};

MeshBone.prototype.computeRestParentTransforms = function()
{
  var cur_tangent = vec3.fromValues(this.local_rest_dir[Q_X], this.local_rest_dir[Q_Y], 0);
  var cur_binormal = vec3.fromValues(this.local_binormal_dir[Q_X], this.local_binormal_dir[Q_Y], this.local_binormal_dir[Q_Z]);
  var cur_normal = vec3.fromValues(this.local_rest_normal_dir[Q_X], this.local_rest_normal_dir[Q_Y], 0);

  var cur_translate = mat4.create();
  //cur_translate.setTranslation(local_rest_end_pt.x, local_rest_end_pt.y, 0);
  mat4.translate(cur_translate, cur_translate, this.local_rest_end_pt);

  var cur_rotate = mat4.create();
  /*
     cur_rotate.Right = cur_tangent;
     cur_rotate.Up = cur_normal;
     cur_rotate.Backward = cur_binormal;
   */
  //cur_rotate.set(cur_tangent, cur_normal, cur_binormal, new Vector3(0,0,0));
  cur_rotate = Utils.setAxisMatrix(cur_tangent, cur_normal, cur_binormal);
  //cur_rotate.tra();

  //Matrix4 cur_final = cur_translate.cpy().mul(cur_rotate);
  var cur_final = mat4.create();
  cur_final = mat4.multiply(cur_final, cur_translate, cur_rotate);

  //rest_world_mat = rest_parent_mat.cpy().mul(cur_final);
  this.rest_world_mat = mat4.create();
  this.rest_world_mat = mat4.multiply(this.rest_world_mat, this.rest_parent_mat, cur_final); 

  this.rest_world_inv_mat = mat4.clone(this.rest_world_mat);
  this.rest_world_inv_mat = mat4.invert(this.rest_world_inv_mat, this.rest_world_inv_mat);
  //Matrix4.Invert(ref rest_world_mat, out rest_world_inv_mat);

//  var world_rest_dir = getWorldRestEndPt().cpy().sub( getWorldRestStartPt());
  var world_rest_dir = vec3.clone(this.getWorldRestEndPt());
  world_rest_dir = vec3.subtract(world_rest_dir, world_rest_dir, this.getWorldRestStartPt());
  
  world_rest_dir = vec3.normalize(world_rest_dir, world_rest_dir);
  this.world_rest_pos = this.getWorldRestStartPt();


  var bind_translate = mat4.create();
  //bind_translate.setTranslation(getWorldRestStartPt().x, getWorldRestStartPt().y, 0);
  bind_translate = mat4.translate(bind_translate, bind_translate, this.getWorldRestStartPt());

  var tVec = vec3.create();
  tVec = vec3.sub(tVec, this.getWorldRestEndPt(), this.getWorldRestStartPt());
  var bind_rotate = Utils.calcRotateMat(tVec);
  //Matrix4 cur_bind_final = bind_translate.cpy().mul(bind_rotate);
  var cur_bind_final = mat4.create();
  cur_bind_final = mat4.multiply(cur_bind_final, bind_translate, bind_rotate);

  this.bind_world_mat = mat4.clone(cur_bind_final);
  this.bind_world_inv_mat = mat4.clone(this.bind_world_mat);
  this.bind_world_inv_mat = mat4.invert(this.bind_world_inv_mat, this.bind_world_inv_mat);
  //Matrix4.Invert(ref bind_world_mat, out bind_world_inv_mat);

  for(var i = 0; i < this.children.length; i++) {
    var cur_bone = this.children[i];
    cur_bone.setRestParentMat(this.rest_world_mat, this.rest_world_inv_mat);
    cur_bone.computeRestParentTransforms();
  }
};

MeshBone.prototype.computeParentTransforms = function()
{
  var translate_parent = mat4.create();
  translate_parent = mat4.translate(translate_parent, translate_parent, this.getWorldEndPt());

  var tVec = vec3.create();
  tVec = vec3.subtract(tVec, this.getWorldEndpt(), this.getWorldStartPt());
  var rotate_parent = Utils.calcRotateMat(tVec);

  var final_transform = mat4.create();
  final_transform = mat4.multiply(final_transform, translate_parent, rotate_parent);

  var final_inv_transform = mat4.clone(final_transform);
  //final_inv_transform.inv();
  final_inv_transform = mat4.invert(final_inv_transform, final_inv_transform);

  for(var i = 0; i < children.length; i++) {
    var cur_bone = children[i];
    cur_bone.setParentWorldMat(final_transform);
    cur_bone.setParentWorldInvMat(final_inv_transform);
    cur_bone.computeParentTransforms();
  }
};

MeshBone.prototype.computeWorldDeltaTransforms = function()
{
  var calc = this.computeDirs(this.world_start_pt, this.world_end_pt);
  var cur_tangent = vec3.fromValues(calc["first"][Q_X], calc["first"][Q_Y], 0);
  var cur_normal = vec3.fromValues(calc["second"][Q_X], calc["second"][Q_Y], 0);
  var cur_binormal = vec3.fromValues(this.local_binormal_dir[Q_X], this.local_binormal_dir[Q_Y], this.local_binormal_dir[Q_Z]);

  var cur_rotate = mat4.create();
  /*
     cur_rotate.Right = cur_tangent;
     cur_rotate.Up = cur_normal;
     cur_rotate.Backward = cur_binormal;
   */
  //cur_rotate.set(cur_tangent, cur_normal, cur_binormal, new Vector3(0,0,0));
  cur_rotate = Utils.setAxisMatrix(cur_tangent, cur_normal, cur_binormal);
  
  //cur_rotate.tra();

  var cur_translate = mat4.create();
  //cur_translate.setTranslation(world_start_pt.x, world_start_pt.y, 0);
  cur_translate = mat4.translate(cur_translate, cur_translate, this.world_start_pt);

  /*
     world_delta_mat = (cur_translate * cur_rotate)
   * bind_world_inv_mat;
   */

  this.world_delta_mat = mat4.create();
//  world_delta_mat = (cur_translate.cpy().mul(cur_rotate)).mul(bind_world_inv_mat);
  this.world_delta_mat = mat4.multiply(this.world_delta_mat, cur_translate, cur_rotate);
  this.world_delta_mat = mat4.multiply(this.world_delta_mat, this.world_delta_mat, this.bind_world_inv_mat);


  //        Quaternion cur_quat = XnaGeometry.Quaternion.CreateFromRotationMatrix(world_delta_mat);
  //var tmpMat = mat3.create();
  //tmpMat = mat3.fromMat4(tmpMat, this.world_delta_mat);
  var cur_quat = Utils.matrixToQuat(this.world_delta_mat);


  var tmp_pos =  Utils.getMatTranslate(this.world_delta_mat);
  this.world_dq = new dualQuat();
  this.world_dq.createFromData(cur_quat, tmp_pos);

  for(var i = 0; i < this.children.length; i++) {
    var cur_bone = this.children[i];
    cur_bone.computeWorldDeltaTransforms();
  }
};

MeshBone.prototype.addChild = function(bone_in)
{
  bone_in.setRestParentMat(this.rest_world_mat, this.rest_world_inv_mat);
  this.children.push(bone_in);
};

MeshBone.prototype.getChildren = function() 
{
  return this.children;
};

MeshBone.prototype.hasBone = function(bone_in)
{
  for(var i = 0; i < this.children.length; i++) {
    var cur_bone = this.children[i];
    if(cur_bone == bone_in) {
      return true;
    }
  }

  return false;
};

MeshBone.prototype.getChildByKey = function(search_key)
{
  if(this.key === search_key) {
    return this;
  }

  var ret_data = null;
  for(var i = 0; i < this.children.length; i++) {
    var cur_bone = this.children[i];

    var result = cur_bone.getChildByKey(search_key);
    if(result != null) {
      ret_data = result;
      break;
    }
  }

  return ret_data;
};

MeshBone.prototype.getKey = function()
{
  return this.key;
};

MeshBone.prototype.getAllBoneKeys = function()
{
  var ret_data = [];
  ret_data.push(this.getKey());

  for(var i = 0; i < this.children.length; i++) {
    var append_data = this.children[i].getAllBoneKeys();
    ret_data = ret_data.concat(append_data);
  }

  return ret_data;
};

MeshBone.prototype.getAllChildren = function()
{
  var ret_data = [];
  ret_data.push(this);
  for(var i = 0; i < this.children.length; i++) {
    var append_data = this.children[i].getAllChildren();
    ret_data = ret_data.concat(append_data);
  }

  return ret_data;
};

MeshBone.prototype.getBoneDepth = function(bone_in, depth)
{
  if(bone_in == this) {
    return depth;
  }

  for(var i = 0; i < this.children.length; i++) {
    var cur_bone = this.children[i];
    var ret_val = cur_bone.getBoneDepth(bone_in, depth + 1);
    if(ret_val != -1) {
      return ret_val;
    }
  }

  return -1;
};

MeshBone.prototype.isLeaf = function() 
{
  return this.children.length == 0;
};

MeshBone.prototype.deleteChildren = function()
{
  for(var i = 0; i < this.children.length; i++) {
    var cur_bone = this.children[i];
    cur_bone.deleteChildren();
  }

  this.children = [];
};

MeshBone.prototype.setTagId = function(value_in)
{
  this.tag_id = value_in;
};

MeshBone.prototype.getTagId = function()
{
  return this.tag_id;
};

MeshBone.prototype.computeDirs = function(start_pt, end_pt)
{
  var tangent = vec3.create();
  tangent = vec3.subtract(tangent, end_pt, start_pt);
  tangent = vec3.normalize(tangent, tangent);

  var normal = Utils.rotateVec_90(tangent);

  var retData = {};
  retData["first"] = tangent;
  retData["second"] = normal;
  
  return retData;
};

MeshBone.prototype.computeRestLength = function()
{
  var tmp_dir = vec3.create();
  //Vector3 tmp_dir = local_rest_end_pt.cpy().sub(local_rest_start_pt);
  tmp_dir = vec3.subtract(tmp_dir, this.local_rest_end_pt, this.local_rest_start_pt);
  
  this.rest_length = vec3.length(tmp_dir);
};

// MeshRenderRegion
function MeshRenderRegion(indices_in, rest_pts_in, uvs_in, start_pt_index_in, end_pt_index_in,
									start_index_in, end_index_in)
{
	this.store_indices = indices_in;
	this.store_rest_pts = rest_pts_in;
	this.store_uvs = uvs_in;

	this.use_local_displacements = false;
	this.use_post_displacements = false;
	this.use_uv_warp = false;
	this.uv_warp_local_offset = vec2.fromValues(0,0);
	this.uv_warp_global_offset = vec2.fromValues(0,0);
	this.uv_warp_scale = vec2.fromValues(1,1);
	this.start_pt_index = start_pt_index_in;
	this.end_pt_index = end_pt_index_in;
	this.start_index = start_index_in;
	this.end_index = end_index_in;
	this.main_bone = null;
	this.local_displacements = [];
	this.post_displacements = [];
	this.uv_warp_ref_uvs = [];
	this.normal_weight_map = {};
	this.fast_normal_weight_map = [];
	this.fast_bones_map = [];
	this.relevant_bones_indices = [];
	this.use_dq = true;
	this.tag_id = -1;

	this.initUvWarp();	
};

MeshRenderRegion.prototype.getIndicesIndex = function()
{
  // return store_indices + (start_index);
  return this.start_index;
};

MeshRenderRegion.prototype.getRestPtsIndex = function()
{
  // return store_rest_pts + (3 * start_pt_index);
  return 3 * this.start_pt_index;
};

MeshRenderRegion.prototype.getUVsIndex = function()
{
  // return store_uvs + (2  * start_pt_index);
  return 2  * this.start_pt_index;
};

MeshRenderRegion.prototype.getNumPts = function()
{
  return this.end_pt_index - this.start_pt_index + 1;
};

MeshRenderRegion.prototype.getStartPtIndex = function()
{
  return this.start_pt_index;
};

MeshRenderRegion.prototype.getEndPtIndex = function()
{
  return this.end_pt_index;
};

MeshRenderRegion.prototype.getNumIndices = function()
{
  return this.end_index - this.start_index + 1;
};

MeshRenderRegion.prototype.getStartIndex = function()
{
  return this.start_index;
};

MeshRenderRegion.prototype.getEndIndex = function()
{
  return this.end_index;
};

var accum_dq = new dualQuat();
var accum_mat = mat4.create();
var final_pt = vec3.create();
var tmp1 = vec3.create();
var tmp2 = vec3.create();

MeshRenderRegion.prototype.poseFinalPts = function(output_pts, output_start_index, bones_map)
{
  var read_pt_index = this.getRestPtsIndex();
  var write_pt_index = output_start_index;

  // point posing
  for(var i = 0; i < 16; i++)
  {
  	accum_mat[i] = 0.0;
  }

  var boneKeys = Object.keys(bones_map);
  var boneKeyLength = boneKeys.length;
  
  for(var i = 0, l = this.getNumPts(); i < l; i++) {
    var cur_rest_pt =
      vec3.set(tmp1, this.store_rest_pts[0 + read_pt_index],
          this.store_rest_pts[1 + read_pt_index],
          this.store_rest_pts[2 + read_pt_index]);
      // vec3.fromValues(this.store_rest_pts[0 + read_pt_index],
      //     this.store_rest_pts[1 + read_pt_index],
      //     this.store_rest_pts[2 + read_pt_index]);

    if(this.use_local_displacements == true) {
      cur_rest_pt[Q_X] += this.local_displacements[i][Q_X];
      cur_rest_pt[Q_Y] += this.local_displacements[i][Q_Y];
    }

  	for(var j = 0; j < 16; j++)
  	{
	  	accum_mat[j] = 0.0;
  	}
    // reuse
    // var accum_dq = new dualQuat();
    accum_dq.reset();

	var curBoneIndices = this.relevant_bones_indices[i];
  	var relevantIndicesLength = curBoneIndices.length;
    for (var j = 0; j < relevantIndicesLength; j++)
    {
      var idx_lookup = curBoneIndices[j];
      var cur_bone = this.fast_bones_map[idx_lookup];
      var cur_weight_val = this.fast_normal_weight_map[idx_lookup][i];
      var cur_im_weight_val = cur_weight_val;

       var world_dq = cur_bone.getWorldDq();
       accum_dq.add(world_dq, cur_weight_val, cur_im_weight_val);
    }

    accum_dq.normalize();
    var tmp_pt = vec3.set(tmp2, cur_rest_pt[Q_X], cur_rest_pt[Q_Y], cur_rest_pt[Q_Z]);
    // var tmp_pt = vec3.fromValues(cur_rest_pt[Q_X], cur_rest_pt[Q_Y], cur_rest_pt[Q_Z]);
    final_pt = accum_dq.transform(tmp_pt);

    // debug start

    // debug end

    if(this.use_post_displacements == true) {
      final_pt[Q_X] += this.post_displacements[i][Q_X];
      final_pt[Q_Y] += this.post_displacements[i][Q_Y];
    }

    output_pts[0 + write_pt_index] = final_pt[Q_X];
    output_pts[1 + write_pt_index] = final_pt[Q_Y];
    output_pts[2 + write_pt_index] = final_pt[Q_Z];



    read_pt_index += 3;
    write_pt_index += 3;
  }

  // uv warping
  if(this.use_uv_warp == true) {
    this.runUvWarp();
  }
};

MeshRenderRegion.prototype.setMainBoneKey = function(key_in)
{
  this.main_bone_key = key_in;
};

MeshRenderRegion.prototype.determineMainBone = function(root_bone_in)
{
  this.main_bone = root_bone_in.getChildByKey(this.main_bone_key);
};

MeshRenderRegion.prototype.setUseDq = function(flag_in)
{
  this.use_dq = flag_in;
};

MeshRenderRegion.prototype.setName = function(name_in)
{
  this.name = name_in;
};

MeshRenderRegion.prototype.getName = function()
{
  return this.name;
};

MeshRenderRegion.prototype.setUseLocalDisplacements = function(flag_in)
{
  this.use_local_displacements = flag_in;
  if((this.local_displacements.length != this.getNumPts())
      && this.use_local_displacements)
  {
    this.local_displacements = [];
    for(var i = 0; i < this.getNumPts(); i++) {
      this.local_displacements.push (vec2.create());
    }
  }
};

MeshRenderRegion.prototype. getUseLocalDisplacements = function()
{
  return this.use_local_displacements;
};

MeshRenderRegion.prototype.setUsePostDisplacements = function(flag_in)
{
  this.use_post_displacements = flag_in;
  if((this.post_displacements.length != this.getNumPts())
      && this.use_post_displacements)
  {
    this.post_displacements = [];
    for(var i = 0; i < this.getNumPts(); i++) {
      this.post_displacements.push(vec2.create());
    }
  }
};

MeshRenderRegion.prototype.getUsePostDisplacements = function()
{
  return this.use_post_displacements;
};

MeshRenderRegion.prototype.getRestLocalPt = function(index_in)
{
  var read_pt_index = this.getRestPtsIndex() + (3 * index_in);
  var return_pt = vec2.fromValues(this.store_rest_pts[0 + read_pt_index],
      this.store_rest_pts[1 + read_pt_index]);
  return return_pt;
};

MeshRenderRegion.prototype.getLocalIndex = function(index_in)
{
  var read_index = this.getIndicesIndex() + index_in;
  return this.store_indices[read_index];
};

MeshRenderRegion.prototype.clearLocalDisplacements = function()
{
  for(var i = 0; i < this.local_displacements.length; i++) {
    this.local_displacements[i] = vec2.create();
  }
};

MeshRenderRegion.prototype.clearPostDisplacements = function()
{
  for(var i = 0; i < this.post_displacements.length; i++) {
    this.post_displacements[i] = vec2.create();
  }
};

MeshRenderRegion.prototype.setUseUvWarp = function(flag_in)
{
  this.use_uv_warp = flag_in;
  if(this.use_uv_warp == false) {
    this.restoreRefUv();
  }
};

MeshRenderRegion.prototype. getUseUvWarp = function()
{
  return this.use_uv_warp;
};

MeshRenderRegion.prototype.setUvWarpLocalOffset = function(vec_in)
{
  this.uv_warp_local_offset = vec_in;
};

MeshRenderRegion.prototype.setUvWarpGlobalOffset = function(vec_in)
{
  this.uv_warp_global_offset = vec_in;
};

MeshRenderRegion.prototype.setUvWarpScale = function(vec_in)
{
  this.uv_warp_scale = vec_in;
};

MeshRenderRegion.prototype. getUvWarpLocalOffset = function()
{
  return this.uv_warp_local_offset;
};

MeshRenderRegion.prototype. getUvWarpGlobalOffset = function()
{
  return this.uv_warp_global_offset;
};

MeshRenderRegion.prototype. getUvWarpScale = function()
{
  return this.uv_warp_scale;
};

MeshRenderRegion.prototype.runUvWarp = function()
{
  var cur_uvs_index = this.getUVsIndex();
  for(var i = 0; i < this.uv_warp_ref_uvs.length; i++) {
    var set_uv = vec2.clone(this.uv_warp_ref_uvs[i]);
    
   
    set_uv = vec2.subtract(set_uv, set_uv, this.uv_warp_local_offset);
    set_uv[Q_X] *= this.uv_warp_scale[Q_X];
    set_uv[Q_Y] *= this.uv_warp_scale[Q_Y];
    set_uv = vec2.add(set_uv, set_uv, this.uv_warp_global_offset);
    
   
    /*
    set_uv.sub(uv_warp_local_offset);
    set_uv.scl(uv_warp_scale);
    set_uv.add(uv_warp_global_offset);
    */


    this.store_uvs[0 + cur_uvs_index] = set_uv[Q_X];
    this.store_uvs[1 + cur_uvs_index] = set_uv[Q_Y];


    cur_uvs_index += 2;
  }
};

MeshRenderRegion.prototype.restoreRefUv = function()
{
  var cur_uvs_index = this.getUVsIndex();
  for(var i = 0; i < this.uv_warp_ref_uvs.length; i++) {
    var set_uv = this.uv_warp_ref_uvs[i];

    this.store_uvs[0 + cur_uvs_index] = set_uv[Q_X];
    this.store_uvs[1 + cur_uvs_index] = set_uv[Q_Y];

    cur_uvs_index += 2;
  }
};

MeshRenderRegion.prototype.getTagId = function()
{
  return this.tag_id;
};

MeshRenderRegion.prototype.setTagId = function(value_in)
{
  this.tag_id = value_in;
};

MeshRenderRegion.prototype.initFastNormalWeightMap = function(bones_map)
{
  this.relevant_bones_indices = [];
  
  // fast normal weight map lookup, avoids hash lookups
  for (var cur_key in bones_map) {
    var values = this.normal_weight_map[cur_key];
    this.fast_normal_weight_map.push(values);
  }
  
  // relevant bone indices
  var cutoff_val = 0.05;
   for(var i = 0; i < this.getNumPts(); i++) {
  	var curIndicesArray = [];
   	for (var j = 0; j < this.fast_normal_weight_map.length; j++)
  	{
  		var cur_val = this.fast_normal_weight_map[j][i];
  		if(cur_val > cutoff_val)
  		{
  			curIndicesArray.push(j);
  		}  		
  	}
  	
  	this.relevant_bones_indices.push(curIndicesArray);
  }
  
  // fast bone map lookup
    for (var cur_key in bones_map) {
    	var cur_bone = bones_map[cur_key];
    	this.fast_bones_map.push(cur_bone);
    }
};

MeshRenderRegion.prototype.initUvWarp = function()
{
  var cur_uvs_index = this.getUVsIndex();
  //        uv_warp_ref_uvs = new java.util.Vector<Vector2>(new Vector2[getNumPts()]);
  this.uv_warp_ref_uvs = [];;

  for(var i = 0; i < this.getNumPts(); i++) {
    this.uv_warp_ref_uvs.push(vec2.create());
    
    this.uv_warp_ref_uvs[i] = vec2.fromValues(this.store_uvs[cur_uvs_index],
    										this.store_uvs[cur_uvs_index + 1]);
     


    cur_uvs_index += 2;
  }
};


// MeshRenderBoneComposition
function MeshRenderBoneComposition()
{
	this.root_bone = null;
    this.bones_map = {};
    this.regions = [];
    this.regions_map = {};
};

MeshRenderBoneComposition.prototype.addRegion = function(region_in)
{
  this.regions.push(region_in);
};

MeshRenderBoneComposition.prototype.setRootBone = function(root_bone_in)
{
  this.root_bone = root_bone_in;
};

MeshRenderBoneComposition.prototype.getRootBone = function()
{
  return this.root_bone;
};

MeshRenderBoneComposition.prototype.initBoneMap = function()
{
  this.bones_map = MeshRenderBoneComposition.genBoneMap(this.root_bone);
};

MeshRenderBoneComposition.prototype.initRegionsMap = function()
{
  this.regions_map = {};
  for(var i = 0; i < this.regions.length; i++) {
    cur_key = this.regions[i].getName();
    this.regions_map[cur_key] = this.regions[i];
  }
};

MeshRenderBoneComposition.genBoneMap = function(input_bone)
{
  var ret_map = {};
  var all_keys = input_bone.getAllBoneKeys();
  for(var i = 0; i < all_keys.length; i++) {
    var cur_key = all_keys[i];
    ret_map[cur_key] = input_bone.getChildByKey(cur_key);
  }

  return ret_map;
};

MeshRenderBoneComposition.prototype.getBonesMap = function()
{
  return this.bones_map;
};

MeshRenderBoneComposition.prototype.getRegionsMap = function()
{
  return this.regions_map;
};

MeshRenderBoneComposition.prototype.getRegions = function()
{
  return this.regions;
};

MeshRenderBoneComposition.prototype.getRegionWithId = function(id_in)
{
  for(var i = 0; i < this.regions.length; i++) {
    var cur_region = this.regions[i];
    if(cur_region.getTagId() == id_in) {
      return cur_region;
    }
  }

  return null;
};

MeshRenderBoneComposition.prototype.resetToWorldRestPts = function()
{
  this.getRootBone().initWorldPts();
};

MeshRenderBoneComposition.prototype.updateAllTransforms = function(update_parent_xf)
{
  if(update_parent_xf) {
    this.getRootBone().computeParentTransforms();
  }

  this.getRootBone().computeWorldDeltaTransforms();
  this.getRootBone().fixDQs(this.getRootBone().getWorldDq());
};

// MeshBoneCache
function MeshBoneCache(key_in)
{
	this.key = key_in;
};

MeshBoneCache.prototype.setWorldStartPt = function(pt_in) {
  this.world_start_pt = pt_in;
};

MeshBoneCache.prototype.setWorldEndPt = function(pt_in) {
  this.world_end_pt = pt_in;
};

MeshBoneCache.prototype.getWorldStartPt = function() {
  return this.world_start_pt;
};

MeshBoneCache.prototype.getWorldEndPt = function() {
  return this.world_end_pt;
};

MeshBoneCache.prototype.getKey = function() {
  return this.key;
};

// MeshDisplacementCache
function MeshDisplacementCache(key_in)
{
	this.key = key_in;
	this.local_displacements = [];
	this.post_displacements = [];
};

MeshDisplacementCache.prototype.setLocalDisplacements = function(displacements_in)
{
  this.local_displacements = displacements_in;
};

MeshDisplacementCache.prototype.setPostDisplacements = function(displacements_in)
{
  this.post_displacements = displacements_in;
};

MeshDisplacementCache.prototype.getKey = function() {
  return this.key;
};

MeshDisplacementCache.prototype.getLocalDisplacements = function()
{
  return this.local_displacements;
};

MeshDisplacementCache.prototype.getPostDisplacements = function()
{
  return this.post_displacements;
};


// MeshUVWarpCache
function MeshUVWarpCache(key_in)
{
	this.uv_warp_global_offset = vec2.create();
    this.uv_warp_local_offset = vec2.create();
    this.uv_warp_scale = vec2.fromValues(-1,-1);
    this.key = key_in;
    this.enabled = false;
};

MeshUVWarpCache.prototype.setUvWarpLocalOffset = function(vec_in)
{
  this.uv_warp_local_offset = vec_in;
};

MeshUVWarpCache.prototype.setUvWarpGlobalOffset = function(vec_in)
{
  this.uv_warp_global_offset = vec_in;
};

MeshUVWarpCache.prototype.setUvWarpScale = function(vec_in)
{
  this.uv_warp_scale = vec_in;
};

MeshUVWarpCache.prototype.getUvWarpLocalOffset = function()
{
  return this.uv_warp_local_offset;
};

MeshUVWarpCache.prototype.getUvWarpGlobalOffset = function()
{
  return this.uv_warp_global_offset;
};

MeshUVWarpCache.prototype.getUvWarpScale = function()
{
  return this.uv_warp_scale;
};

MeshUVWarpCache.prototype.getKey = function() {
  return this.key;
};

MeshUVWarpCache.prototype.setEnabled = function(flag_in)
{
  this.enabled = flag_in;
};

MeshUVWarpCache.prototype.getEnabled = function() {
  return this.enabled;
};

// MeshBoneCacheManager
function MeshBoneCacheManager()
{
	this.is_ready = false;
	this.bone_cache_table = null;
	this.bone_cache_data_ready = null;
	this.bone_cache_table = [];
	this.bone_cache_data_ready = [];
};

MeshBoneCacheManager.prototype.init = function(start_time_in, end_time_in)
{
  this.start_time = start_time_in;
  this.end_time = end_time_in;

  var num_frames = this.end_time - this.start_time + 1;
  this.bone_cache_table = [];

  this.bone_cache_data_ready = [];
  for(var i = 0; i < num_frames; i++) {
    this.bone_cache_table.push([]);
    this.bone_cache_data_ready.push(false);
  }

  this.is_ready = false;
};

MeshBoneCacheManager.prototype.getStartTime = function()
{
  return this.start_time;
};

MeshBoneCacheManager.prototype.getEndime = function()
{
  return this.end_time;
};

MeshBoneCacheManager.prototype.getIndexByTime = function(time_in)
{
  var retval = time_in - this.start_time;
  retval = Utils.clamp(retval, 0, (this.bone_cache_table.length) - 1);

  return retval;
};

MeshBoneCacheManager.prototype.retrieveValuesAtTime = function(time_in, bone_map)
{
  var base_time = this.getIndexByTime(Math.floor(time_in));
  var end_time = this.getIndexByTime(Math.ceil(time_in));

  var ratio = (time_in - Math.floor(time_in));

  if(this.bone_cache_data_ready.length == 0) {
    return;
  }

  if((this.bone_cache_data_ready[base_time] == false)
      || ((this.bone_cache_data_ready[end_time] == false)))
  {
    return;
  }

  var base_cache = this.bone_cache_table[base_time];
  var end_cache = this.bone_cache_table[end_time];

  for(var i = 0, l = base_cache.length; i < l; i++) {
    var base_data = base_cache[i];
    var end_data = end_cache[i];
    var cur_key = base_data.getKey();

    var final_world_start_pt = Utils.vecInterp(base_data.getWorldStartPt(), end_data.getWorldStartPt(), ratio);

    var final_world_end_pt = Utils.vecInterp(base_data.getWorldEndPt(), end_data.getWorldEndPt(), ratio);

    /*
       Vector3 final_world_start_pt = ((1.0f - ratio) * base_data.getWorldStartPt()) +
       (ratio * end_data.getWorldStartPt());

       Vector3 final_world_end_pt = ((1.0f - ratio) * base_data.getWorldEndPt()) +
       (ratio * end_data.getWorldEndPt());
     */

    bone_map[cur_key].setWorldStartPt(final_world_start_pt);
    bone_map[cur_key].setWorldEndPt(final_world_end_pt);
  }
};

MeshBoneCacheManager.prototype.allReady = function()
{
  if(this.is_ready) {
    return true;
  }
  else {
    var num_frames = this.end_time - this.start_time + 1;
    var ready_cnt = 0;
    for(var i = 0; i < this.bone_cache_data_ready.size(); i++) {
      if(this.bone_cache_data_ready[i]) {
        ready_cnt++;
      }
    }

    if(ready_cnt == num_frames) {
      this.is_ready = true;
    }
  }

  return this.is_ready;
};

MeshBoneCacheManager.prototype.makeAllReady = function()
{
  for(var i = 0; i < this.bone_cache_data_ready.length; i++) {
    this.bone_cache_data_ready[i] = true;
  }
};

// MeshDisplacementCacheManager
function MeshDisplacementCacheManager()
{
	this.is_ready = false;
    this.displacement_cache_table = null;
    this.displacement_cache_data_ready = null;
    this.displacement_cache_table = [];
    this.displacement_cache_data_ready = [];
};

MeshDisplacementCacheManager.prototype.init = function(start_time_in, end_time_in)
{
  this.start_time = start_time_in;
  this.end_time = end_time_in;

  var num_frames = this.end_time - this.start_time + 1;
  this.displacement_cache_table = [];

  this.displacement_cache_data_ready = [];
  for(var i = 0; i < num_frames; i++) {
    this.displacement_cache_table.push([]);
    this.displacement_cache_data_ready.push(false);
  }

  this.is_ready = false;
};

MeshDisplacementCacheManager.prototype.getStartTime = function()
{
  return this.start_time;
};

MeshDisplacementCacheManager.prototype.getEndime = function()
{
  return this.end_time;
};

MeshDisplacementCacheManager.prototype.getIndexByTime = function(time_in)
{
  var retval = time_in - this.start_time;
  retval = Utils.clamp(retval, 0, (this.displacement_cache_table.length) - 1);

  return retval;
};

MeshDisplacementCacheManager.prototype.retrieveValuesAtTime = function(time_in, regions_map)
{
  var base_time = this.getIndexByTime(Math.floor(time_in));
  var end_time = this.getIndexByTime(Math.ceil(time_in));

  var ratio = (time_in - Math.floor(time_in));

  if(this.displacement_cache_data_ready.length == 0) {
    return;
  }

  if((this.displacement_cache_data_ready[base_time] == false)
      || (this.displacement_cache_data_ready[end_time] == false))
  {
    return;
  }

  var base_cache = this.displacement_cache_table[base_time];
  var end_cache = this.displacement_cache_table[end_time];

  for(var i = 0; i < base_cache.length; i++) {
    var base_data = base_cache[i];
    var end_data = end_cache[i];
    var cur_key = base_data.getKey();

    var set_region = regions_map[cur_key];

    if(set_region.getUseLocalDisplacements()) {
      var displacements =
        set_region.local_displacements;
      if((base_data.getLocalDisplacements().length == displacements.length)
          && (end_data.getLocalDisplacements().length == displacements.length))
      {
        for(var j = 0; j < displacements.length; j++) {
          var interp_val = Utils.vec2Interp(base_data.getLocalDisplacements()[j], 
          									end_data.getLocalDisplacements()[j],
          									ratio);
                
          /*
             Vector2 interp_val =
             ((1.0f - ratio) * base_data.getLocalDisplacements().get(j)) +
             (ratio * end_data.getLocalDisplacements().get(j));
           */

          displacements[j] = interp_val;
        }
      }
      else {
        for(var j = 0; j < displacements.length; j++) {
          displacements[j] = vec2.create();
        }
      }
    }

    if(set_region.getUsePostDisplacements()) {
      var displacements =
        set_region.post_displacements;
      if((base_data.getPostDisplacements().length == displacements.length)
          && (end_data.getPostDisplacements().length == displacements.length))
      {

        for(var j = 0; j < displacements.length; j++) {
          var interp_val = Utils.vec2Interp(base_data.getPostDisplacements()[j], 
          									end_data.getPostDisplacements()[j],
          									ratio);                
                
          /*
             Vector2 interp_val =
             ((1.0f - ratio) * base_data.getPostDisplacements()[j]) +
             (ratio * end_data.getPostDisplacements()[j]);
           */
          displacements[j] = interp_val;
        }
      }
      else {
        for(var j = 0; j < displacements.length; j++) {
          displacements.set[j] = vec2.create();
        }
      }
    }
  }
};

MeshDisplacementCacheManager.prototype.allReady = function()
{
  if(this.is_ready) {
    return true;
  }
  else {
    var num_frames = this.end_time - this.start_time + 1;
    var ready_cnt = 0;
    for(var i = 0; i < this.displacement_cache_data_ready.length; i++) {
      if(this.displacement_cache_data_ready[i]) {
        ready_cnt++;
      }
    }

    if(ready_cnt == num_frames) {
      this.is_ready = true;
    }
  }

  return this.is_ready;
};

MeshDisplacementCacheManager.prototype.makeAllReady = function()
{
  for(var i = 0; i < this.displacement_cache_data_ready.length; i++) {
    this.displacement_cache_data_ready[i] = true;
  }
};

// MeshUVWarpCacheManager
function MeshUVWarpCacheManager()
{
	this.is_ready = false;
    this.uv_cache_table = null;
    this.uv_cache_data_ready = null;
    this.uv_cache_table = [];
    this.uv_cache_data_ready = [];	
};

MeshUVWarpCacheManager.prototype.init = function(start_time_in, end_time_in)
{
  this.start_time = start_time_in;
  this.end_time = end_time_in;

  var num_frames = this.end_time - this.start_time + 1;
  this.uv_cache_table = [];

  this.uv_cache_data_ready = [];
  for(var i = 0; i < num_frames; i++) {
    this.uv_cache_table.push([]);
    this.uv_cache_data_ready.push(false);
  }

  this.is_ready = false;
};

MeshUVWarpCacheManager.prototype.getStartTime = function()
{
  return this.start_time;
};

MeshUVWarpCacheManager.prototype.getEndime = function()
{
  return this.end_time;
};

MeshUVWarpCacheManager.prototype.getIndexByTime = function(time_in)
{
  var retval = time_in - this.start_time;
  retval = Utils.clamp(retval, 0, (this.uv_cache_table.length) - 1);

  return retval;
};

MeshUVWarpCacheManager.prototype.retrieveValuesAtTime = function(time_in, regions_map)
{
  var base_time = this.getIndexByTime(Math.floor(time_in));
  var end_time = this.getIndexByTime(Math.ceil(time_in));

  var ratio = (time_in - Math.floor(time_in));

  if(this.uv_cache_data_ready.length == 0) {
    return;
  }

  if((this.uv_cache_data_ready[base_time] == false)
      || (this.uv_cache_data_ready[end_time] == false))
  {
    return;
  }

  var base_cache = this.uv_cache_table[base_time];
  var end_cache = this.uv_cache_table[end_time];

  for(var i = 0; i < base_cache.length; i++) {
    var base_data = base_cache[i];
    var end_data = end_cache[i];
    var cur_key = base_data.getKey();

    var set_region = regions_map[cur_key];
    if(set_region.getUseUvWarp()) {
      var final_local_offset = base_data.getUvWarpLocalOffset();
      
 
      var final_global_offset = base_data.getUvWarpGlobalOffset();

      var final_scale = base_data.getUvWarpScale();
      /*
         Vector2 final_local_offset = ((1.0f - ratio) * base_data.getUvWarpLocalOffset()) +
         (ratio * end_data.getUvWarpLocalOffset());

         Vector2 final_global_offset = ((1.0f - ratio) * base_data.getUvWarpGlobalOffset()) +
         (ratio * end_data.getUvWarpGlobalOffset());

         Vector2 final_scale = ((1.0f - ratio) * base_data.getUvWarpScale()) +
         (ratio * end_data.getUvWarpScale());

       */


      set_region.setUvWarpLocalOffset(final_local_offset);
      set_region.setUvWarpGlobalOffset(final_global_offset);
      set_region.setUvWarpScale(final_scale);
    }
  }
};

MeshUVWarpCacheManager.prototype.allReady = function()
{
  if(this.is_ready) {
    return true;
  }
  else {
    var num_frames = this.end_time - this.start_time + 1;
    var ready_cnt = 0;
    for(var i = 0; i < this.uv_cache_data_ready.length; i++) {
      if(uv_cache_data_ready[i]) {
        ready_cnt++;
      }
    }

    if(ready_cnt == num_frames) {
      this.is_ready = true;
    }
  }

  return this.is_ready;
};

MeshUVWarpCacheManager.prototype.makeAllReady = function()
{
  for(var i = 0; i < this.uv_cache_data_ready.length; i++) {
    this.uv_cache_data_ready[i] = true;
  }
};

// CreatureModuleUtils
var CreatureModuleUtils = {};

CreatureModuleUtils.GetAllAnimationNames = function(json_data)
{
  var json_animations = json_data["animation"];
  var keys = [];
  for (var name in json_animations)
  {
    keys.push(name);
  }

  return keys;
};

CreatureModuleUtils.getFloatArray = function(raw_data)
{
  return raw_data;
};

CreatureModuleUtils.getIntArray = function(raw_data)
{
  return raw_data;
};


CreatureModuleUtils.ReadPointsArray2DJSON = function(data, key)
{
  var raw_array = CreatureModuleUtils.getFloatArray(data[key]);
  var ret_list = [];
  var num_points = raw_array.length / 2;
  for (var i = 0; i < num_points; i++)
  {
    var cur_index = i * 2;
    ret_list.push(
        vec2.fromValues(raw_array[0 + cur_index], raw_array[1 + cur_index]));
  }

  return ret_list;
};

CreatureModuleUtils.ReadFloatArray3DJSON = function(data, key)
{
  var raw_array = CreatureModuleUtils.getFloatArray(data[key]);

  var ret_list = [];
  var num_points = raw_array.length / 2;
  for (var i = 0; i < num_points; i++)
  {
    var cur_index = i * 2;
    ret_list.push(raw_array[0 + cur_index]);
    ret_list.push(raw_array[1 + cur_index]);
    ret_list.push(0);
  }

  return ret_list;
};

CreatureModuleUtils.ReadBoolJSON = function(data, key)
{
  var val = data[key];
  return val;
};

CreatureModuleUtils.ReadFloatArrayJSON = function(data, key)
{
  /*
  var raw_array = getFloatArray(data.get[key]);
  var ret_list = [];
  for(var i = 0; i < raw_array.length; i++)
  {
    ret_list.push(raw_array[i]);
  }

  return ret_list;
  */
 
  return data[key];
};

CreatureModuleUtils.ReadIntArrayJSON = function(data, key)
{
  /*
  int[] raw_array = getIntArray (data.get(key));
  java.util.Vector<Integer> ret_list = new java.util.Vector<Integer>();

  for(int i = 0; i < raw_array.length; i++) {
    ret_list.add(raw_array[i]);
  }

  return ret_list;
  */
   return data[key];
};

CreatureModuleUtils.ReadMatrixJSON = function(data, key)
{
  var raw_array = CreatureModuleUtils.getFloatArray(data[key]);
  var retMat = mat4.create();
  for(var i = 0; i < 16; i++)
  {
  	retMat[i] = raw_array[i];
  }
  
  return retMat;
};

CreatureModuleUtils.ReadVector2JSON = function(data, key)
{
  var raw_array = CreatureModuleUtils.getFloatArray(data[key]);
  return vec2.fromValues(raw_array[0], raw_array[1]);
};


CreatureModuleUtils.ReadVector3JSON = function(data, key)
{
  var raw_array = CreatureModuleUtils.getFloatArray(data[key]);
  return vec3.fromValues(raw_array[0], raw_array[1], 0);
};

CreatureModuleUtils.CreateBones = function(json_obj, key) {
  var root_bone = null;
  var base_obj = json_obj[key];
  //var bone_data = new HashMap<Integer, Tuple<MeshBone, Vector<Integer>>>();
  var bone_data = {};
  var child_set = {};

  // layout bones
  for (var cur_name in base_obj)
  {
  	
    var cur_node = base_obj[cur_name];

    var cur_id = cur_node["id"]; //GetJSONNodeFromKey(*cur_node, "id")->value.toNumber();
    var cur_parent_mat = CreatureModuleUtils.ReadMatrixJSON(cur_node, "restParentMat");

    var cur_local_rest_start_pt = CreatureModuleUtils.ReadVector3JSON(cur_node, "localRestStartPt");
    var cur_local_rest_end_pt = CreatureModuleUtils.ReadVector3JSON(cur_node, "localRestEndPt");
    var cur_children_ids = CreatureModuleUtils.ReadIntArrayJSON(cur_node, "children");

    var new_bone = new MeshBone(cur_name,
        vec3.create(),
        vec3.create(),
        cur_parent_mat);
    new_bone.local_rest_start_pt = cur_local_rest_start_pt;
    new_bone.local_rest_end_pt = cur_local_rest_end_pt;
    new_bone.calcRestData();
    new_bone.setTagId(cur_id);

    bone_data[cur_id] = {first:new_bone, second:cur_children_ids};

    for(var i = 0; i < cur_children_ids.length; i++){
      var cur_child_id = cur_children_ids[i];
      child_set[cur_child_id] = cur_child_id;
    }
  }

  // Find root
  for(var cur_id in bone_data)
  {
    if( (cur_id in child_set) == false) {
      // not a child, so is root
	  var cur_data = bone_data[cur_id]; 
      root_bone = cur_data.first;
      break;
    }
  }

  // construct hierarchy
  for(var cur_id in bone_data)
  {
 	var cur_data = bone_data[cur_id]; 

    var cur_bone = cur_data.first;
    var children_ids = cur_data.second;
    for(var i = 0; i < children_ids.length; i++)
    {
      var cur_child_id = children_ids[i];
      var child_bone = bone_data[cur_child_id].first;
      cur_bone.addChild(child_bone);
    }

  }


  return root_bone;
};

CreatureModuleUtils.CreateRegions = function(json_obj, key, indices_in, rest_pts_in, uvs_in)
{
  var ret_regions = [];
  var base_obj = json_obj[key];

  for (var cur_name in base_obj)
  {
  	var cur_node = base_obj[cur_name];

    var cur_id = cur_node["id"]; //(int)GetJSONNodeFromKey(*cur_node, "id")->value.toNumber();
    var cur_start_pt_index = cur_node["start_pt_index"]; //(int)GetJSONNodeFromKey(*cur_node, "start_pt_index")->value.toNumber();
    var cur_end_pt_index = cur_node["end_pt_index"]; //(int)GetJSONNodeFromKey(*cur_node, "end_pt_index")->value.toNumber();
    var cur_start_index = cur_node["start_index"]; //(int)GetJSONNodeFromKey(*cur_node, "start_index")->value.toNumber();
    var cur_end_index = cur_node["end_index"]; //(int)GetJSONNodeFromKey(*cur_node, "end_index")->value.toNumber();

    var new_region = new MeshRenderRegion(indices_in,
        rest_pts_in,
        uvs_in,
        cur_start_pt_index,
        cur_end_pt_index,
        cur_start_index,
        cur_end_index);

    new_region.setName(cur_name);
    new_region.setTagId(cur_id);

    // Read in weights
    var weight_map =
      new_region.normal_weight_map;
    var weight_obj = cur_node["weights"];

    for (var w_key in weight_obj)
    {
      var w_node = weight_obj[w_key];
      var values = CreatureModuleUtils.ReadFloatArrayJSON(weight_obj, w_key);
      weight_map[w_key] = values;
    }

    ret_regions.push(new_region);
  }

  return ret_regions;
};

CreatureModuleUtils.GetStartEndTimes = function(json_obj, key)
{
  var start_time = 0;
  var end_time = 0;
  var first = true;
  var base_obj = json_obj[key];

  for (var cur_val in base_obj)
  {
    var cur_node = base_obj[cur_val];
    var cur_num = parseInt(cur_val);
    if(first) {
      start_time = cur_num;
      end_time = cur_num;
      first = false;
    }
    else {
      if(cur_num > end_time) {
        end_time = cur_num;
      }
      
      if(cur_num < start_time) {
        start_time = cur_num;
      }
    }
  }

  return {first:start_time, second:end_time};
};

CreatureModuleUtils.FillBoneCache = function(json_obj, key, start_time, end_time, cache_manager)
{
  var base_obj = json_obj[key];

  cache_manager.init(start_time, end_time);

  for (var cur_time in base_obj)
  {
  	var cur_node = base_obj[cur_time];

    cache_list = [];

    for (var cur_name in cur_node)
    {
      var bone_node = cur_node[cur_name];

      var cur_start_pt = CreatureModuleUtils.ReadVector3JSON(bone_node, "start_pt"); //ReadJSONVec4_2(*bone_node, "start_pt");
      var cur_end_pt = CreatureModuleUtils.ReadVector3JSON(bone_node, "end_pt"); //ReadJSONVec4_2(*bone_node, "end_pt");

      var cache_data = new MeshBoneCache(cur_name);
      cache_data.setWorldStartPt(cur_start_pt);
      cache_data.setWorldEndPt(cur_end_pt);

      cache_list.push(cache_data);
    }

    var set_index = cache_manager.getIndexByTime(cur_time);
    cache_manager.bone_cache_table[set_index] = cache_list;
  }

  cache_manager.makeAllReady();
};

CreatureModuleUtils.FillDeformationCache = function(json_obj, key, start_time, end_time, cache_manager)
{
  var base_obj = json_obj[key];

  cache_manager.init(start_time, end_time);

  for (var cur_time in base_obj)
  {
  	var cur_node = base_obj[cur_time];

    var cache_list = [];

    for (var cur_name in cur_node)
    {
      var mesh_node = cur_node[cur_name];

      var cache_data = new MeshDisplacementCache(cur_name);

      var use_local_displacement = CreatureModuleUtils.ReadBoolJSON(mesh_node, "use_local_displacements"); //GetJSONNodeFromKey(*mesh_node, "use_local_displacements")->value.toBool();
      var use_post_displacement = CreatureModuleUtils.ReadBoolJSON(mesh_node, "use_post_displacements"); //GetJSONNodeFromKey(*mesh_node, "use_post_displacements")->value.toBool();

      if(use_local_displacement == true) {
        var read_pts = CreatureModuleUtils.ReadPointsArray2DJSON(mesh_node, "local_displacements"); //ReadJSONPoints2DVector(*mesh_node, "local_displacements");
        cache_data.setLocalDisplacements(read_pts);
      }

      if(use_post_displacement == true) {
        var read_pts = CreatureModuleUtils.ReadPointsArray2DJSON(mesh_node, "post_displacements"); //ReadJSONPoints2DVector(*mesh_node, "post_displacements");
        cache_data.setPostDisplacements(read_pts);
      }

      cache_list.push(cache_data);
    }

    var set_index = cache_manager.getIndexByTime(cur_time);
    cache_manager.displacement_cache_table[set_index] = cache_list;
  }

  cache_manager.makeAllReady();
};

CreatureModuleUtils.FillUVSwapCache = function(json_obj, key, start_time, end_time, cache_manager)
{
  var base_obj = json_obj[key];

  cache_manager.init(start_time, end_time);

  for (var cur_time in base_obj)
  {
  	var cur_node = base_obj[cur_time];

    var cache_list = [];

    for (var cur_name in cur_node)
    {
      var uv_node = cur_node[cur_name];

      var cache_data = new MeshUVWarpCache(cur_name);
      var use_uv = CreatureModuleUtils.ReadBoolJSON(uv_node, "enabled"); //GetJSONNodeFromKey(*uv_node, "enabled")->value.toBool();
      cache_data.setEnabled(use_uv);
      if(use_uv == true) {
        var local_offset = CreatureModuleUtils.ReadVector2JSON(uv_node, "local_offset"); //ReadJSONVec2(*uv_node, "local_offset");
        var global_offset = CreatureModuleUtils.ReadVector2JSON(uv_node, "global_offset"); //ReadJSONVec2(*uv_node, "global_offset");
        var scale = CreatureModuleUtils.ReadVector2JSON(uv_node, "scale"); //ReadJSONVec2(*uv_node, "scale");
        cache_data.setUvWarpLocalOffset(local_offset);
        cache_data.setUvWarpGlobalOffset(global_offset);
        cache_data.setUvWarpScale(scale);
      }

      cache_list.push(cache_data);
    }

    var set_index = cache_manager.getIndexByTime(cur_time);
    cache_manager.uv_cache_table[set_index] = cache_list;
  }

  cache_manager.makeAllReady();
};

// Creature
function Creature(load_data)
{
	this.total_num_pts = 0;
    this.total_num_indices = 0;
    this.global_indices = null;
    this.global_pts = null;
    this.global_uvs = null;
    this.render_pts = null;
    this.render_colours = null;
    this.render_composition = null;
    this.boundary_indices = [];
    this.boundary_min = vec2.create();
    this.boundary_max = vec2.create();

    this.LoadFromData(load_data);	
};

// Fills entire mesh with (r,g,b,a) colours
Creature.prototype.FillRenderColours = function(r, g, b, a)
{
  for(var i = 0; i < this.total_num_pts; i++)
  {
    var cur_colour_index = i * 4;
    this.render_colours[0 + cur_colour_index] = r;
    this.render_colours[1 + cur_colour_index] = g;
    this.render_colours[2 + cur_colour_index] = b;
    this.render_colours[3 + cur_colour_index] = a;
  }
};

// Compute boundary indices

Creature.prototype.ComputeBoundaryIndices = function()
{
	var freq_table = {};
	for(var i = 0; i < this.total_num_pts; i++)
	{
		freq_table[i] = 0;
	}
	
	var cur_regions = this.render_composition.getRegions();
	for(var i = 0; i < this.global_indices.length; i++)
	{
		var cur_idx = this.global_indices[i];
		var is_found = false;
		for(var j = 0; j < cur_regions.length; j++)
		{
    		var cur_region = cur_regions[j];
    		var cur_start_index = cur_region.getStartPtIndex();
    		var cur_end_index = cur_region.getEndPtIndex();
    		
    		if(cur_idx >= cur_start_index && cur_idx <= cur_end_index)
    		{
    			is_found = true;
    			break;
    		}
    	}


		if(is_found)
		{
			freq_table[cur_idx]++;
		}
	}
	
	// now find the boundary indices who have <= 5 referenced triangles
	this.boundary_indices = [];
	for(var i = 0; i < this.total_num_pts; i++)
	{
		if(freq_table[i] <=5)
		{
			this.boundary_indices.push(i);
		}
	}
};

// Compute min and max bounds of the animated mesh
Creature.prototype.ComputeBoundaryMinMax = function()
{
	
	if(this.boundary_indices.length <= 0)
	{
		this.ComputeBoundaryIndices();
	}
	
	
	var firstIdx = this.boundary_indices[0] * 3;
	var minPt = vec2.fromValues(this.render_pts[firstIdx + 0], this.render_pts[firstIdx + 1]);
	var maxPt = vec2.fromValues(minPt[0], minPt[1]);
	
	
	for(var i = 0; i < this.boundary_indices.length; i++)
	{
		var ref_idx = this.boundary_indices[i] * 3;
		var ref_x = this.render_pts[ref_idx];
		var ref_y = this.render_pts[ref_idx + 1];
		
		if(minPt[0] > ref_x)
		{
			minPt[0] = ref_x;
		}
		
		if(minPt[1] > ref_y)
		{
			minPt[1] = ref_y;
		}
		
		if(maxPt[0] < ref_x)
		{
			maxPt[0] = ref_x;
		}
		
		if(maxPt[1] < ref_y)
		{
			maxPt[1] = ref_y;
		}
	}
	
	this.boundary_min = minPt;
	this.boundary_max = maxPt;
};


// Load data
Creature.prototype.LoadFromData = function(load_data)
{
  // Load points and topology
  var json_mesh = load_data["mesh"];

  this.global_pts = CreatureModuleUtils.ReadFloatArray3DJSON(json_mesh, "points");
  this.total_num_pts = this.global_pts.length / 3;

  this.global_indices = CreatureModuleUtils.ReadIntArrayJSON (json_mesh, "indices");
  this.total_num_indices = this.global_indices.length;

  this.global_uvs = CreatureModuleUtils.ReadFloatArrayJSON (json_mesh, "uvs");
  
  
  this.render_colours = [];
  for(var i = 0; i < this.total_num_pts * 4; i++)
  {
    this.render_colours.push(0);
  }
  this.FillRenderColours(1, 1, 1, 1);

  this.render_pts = [];

  // Load bones
  var root_bone = CreatureModuleUtils.CreateBones(load_data, "skeleton");


  // Load regions
  var regions = CreatureModuleUtils.CreateRegions(json_mesh,
      "regions",
      this.global_indices,
      this.global_pts,
      this.global_uvs);

  // Add into composition
  this.render_composition = new MeshRenderBoneComposition();
  this.render_composition.setRootBone(root_bone);
  this.render_composition.getRootBone().computeRestParentTransforms();

  for(var i = 0; i < regions.length; i++) {
  	var cur_region = regions[i];
    cur_region.setMainBoneKey(root_bone.getKey());
    cur_region.determineMainBone(root_bone);
    this.render_composition.addRegion(cur_region);
  }

  this.render_composition.initBoneMap();
  this.render_composition.initRegionsMap();

  for(var i = 0; i < regions.length; i++) {
  	var cur_region = regions[i];
    cur_region.initFastNormalWeightMap(this.render_composition.bones_map);
  }

  this.render_composition.resetToWorldRestPts();
};

// CreatureAnimation
function CreatureAnimation(load_data, name_in)
{
    this.name = name_in;
    this.bones_cache = new MeshBoneCacheManager();
    this.displacement_cache = new MeshDisplacementCacheManager();
    this.uv_warp_cache = new MeshUVWarpCacheManager();
    this.cache_pts = [];
    this.fill_cache_pts = [];

    this.LoadFromData(name_in, load_data);	
};

CreatureAnimation.prototype.LoadFromData = function(name_in, load_data)
{
  var json_anim_base = load_data["animation"];
  var json_clip = json_anim_base[name_in];

  var start_end_times = CreatureModuleUtils.GetStartEndTimes(json_clip, "bones");
  this.start_time = start_end_times.first;
  this.end_time = start_end_times.second;

  // bone animation
  CreatureModuleUtils.FillBoneCache(json_clip,
      "bones",
      this.start_time,
      this.end_time,
      this.bones_cache);

  // mesh deformation animation
  CreatureModuleUtils.FillDeformationCache(json_clip,
      "meshes",
      this.start_time,
      this.end_time,
      this.displacement_cache);

  // uv swapping animation
  CreatureModuleUtils.FillUVSwapCache(json_clip,
      "uv_swaps",
      this.start_time,
      this.end_time,
      this.uv_warp_cache);
};

CreatureAnimation.prototype.getIndexByTime = function(time_in)
{
  var retval = time_in - this.start_time;
  retval = Utils.clamp(retval, 0, (this.cache_pts.length) - 1);

  return retval;
};

CreatureAnimation.prototype.verifyFillCache = function()
{
	if(this.fill_cache_pts.length == (this.end_time - this.start_time + 1))
	{
		// ready to switch over
		this.cache_pts = this.fill_cache_pts;
	}
};

CreatureAnimation.prototype.poseFromCachePts = function(time_in, target_pts, num_pts)
{
        var cur_floor_time = this.getIndexByTime(Math.floor(time_in));
        var cur_ceil_time = this.getIndexByTime(Math.ceil(time_in));
        var cur_ratio = time_in - Math.floor(time_in);
        
        var set_pt = target_pts;
        var floor_pts = this.cache_pts[cur_floor_time];
        var ceil_pts = this.cache_pts[cur_ceil_time];
        
        var set_idx = 0;
        var floor_idx = 0;
        var ceil_idx = 0;
        
        for(var i = 0; i < num_pts; i++)
        {
            set_pt[set_idx + 0] = ((1.0 - cur_ratio) * floor_pts[floor_idx + 0]) + (cur_ratio * ceil_pts[ceil_idx + 0]);
            set_pt[set_idx + 1] = ((1.0 - cur_ratio) * floor_pts[floor_idx + 1]) + (cur_ratio * ceil_pts[ceil_idx + 1]);
            set_pt[set_idx + 2] = ((1.0 - cur_ratio) * floor_pts[floor_idx + 2]) + (cur_ratio * ceil_pts[ceil_idx + 2]);

            set_idx += 3;
            floor_idx += 3;
            ceil_idx += 3;
        }
};

// CreatureManager
function CreatureManager(target_creature_in)
{
    this.target_creature = target_creature_in;
    this.is_playing = false;
    this.run_time = 0;
    this.time_scale = 30.0;
    this.blending_factor = 0;
    this.should_loop = true;
    this.use_custom_time_range = false;
    this.custom_start_time = 0;
    this.custom_end_time = 0;
    this.animations = {};
    this.bones_override_callback = null;

    this.blend_render_pts = [];
    this.blend_render_pts.push([]);
    this.blend_render_pts.push([]);
    this.do_blending = false;

    this.active_blend_animation_names = [];
    this.active_blend_animation_names.push("");
    this.active_blend_animation_names.push("");	
};

// Create an animation
CreatureManager.prototype.CreateAnimation = function(load_data, name_in)
{
  var new_animation = new CreatureAnimation(load_data, name_in);
  this.AddAnimation(new_animation);
};

// Create all animations
CreatureManager.prototype.CreateAllAnimations = function(load_data)
{
  var all_animation_names = CreatureModuleUtils.GetAllAnimationNames (load_data);
  for(var i = 0; i < all_animation_names.length; i++)
  {
  	var cur_name = all_animation_names[i];
    this.CreateAnimation(load_data, cur_name);
  }

  this.SetActiveAnimationName (all_animation_names.get(0));
};

// Add an animation
CreatureManager.prototype.AddAnimation = function(animation_in)
{
  this.animations[animation_in.name] = animation_in;
};

// Return an animation
CreatureManager.prototype.GetAnimation = function(name_in)
{
  return this.animations[name_in];
};

// Return the creature
CreatureManager.prototype.GetCreature = function()
{
  return this.target_creature;
};

// Returns all the animation names
CreatureManager.prototype.GetAnimationNames = function()
{
  var ret_names = [];
  for(var cur_name in animations) {
    ret_names.push(cur_name);
  }

  return ret_names;
};

// Sets the current animation to be active by name
CreatureManager.prototype.SetActiveAnimationName = function(name_in, check_already_active)
{
  if (name_in == null || (name_in in this.animations) == false) {
    return false;
  }
  
  if(check_already_active == true)
  {
  	if(this.active_animation_name == name_in)
  	{
  		return false;
  	}
  }

  this.active_animation_name = name_in;
  var cur_animation = this.animations[this.active_animation_name];
  this.run_time = cur_animation.start_time;

  var displacement_cache_manager = cur_animation.displacement_cache;
  var displacement_table =
    displacement_cache_manager.displacement_cache_table[0];

  var uv_warp_cache_manager = cur_animation.uv_warp_cache;
  var uv_swap_table =
    uv_warp_cache_manager.uv_cache_table[0];

  var render_composition =
    this.target_creature.render_composition;

  var all_regions = render_composition.getRegions();

  var index = 0;
  for(var i = 0; i < all_regions.length; i++)
  {
  	var cur_region = all_regions[i];
    // Setup active or inactive displacements
    var use_local_displacements = !(displacement_table[index].getLocalDisplacements().length == 0);
    var use_post_displacements = !(displacement_table[index].getPostDisplacements().length == 0);
    cur_region.setUseLocalDisplacements(use_local_displacements);
    cur_region.setUsePostDisplacements(use_post_displacements);

    // Setup active or inactive uv swaps
    cur_region.setUseUvWarp(uv_swap_table[index].getEnabled());

    index++;
  }

  return true;
};

// Returns the name of the currently active animation
CreatureManager.prototype.GetActiveAnimationName = function()
{
  return this.active_animation_name;
};

// Returns the table of all animations
CreatureManager.prototype.GetAllAnimations = function()
{
  return this.animations;
};

// Creates a point cache for the current animation
CreatureManager.prototype.MakePointCache = function(animation_name_in)
{
        var store_run_time = this.getRunTime();
        var cur_animation = this.animations[animation_name_in];
        if(cur_animation.length > 0)
        {
            // cache already generated, just exit
            return;
        }
        
        var cache_pts_list = cur_animation.cache_pts;
        
        for(var i = cur_animation.start_time; i <= cur_animation.end_time; i++)
        {
            this.setRunTime(i);
            var new_pts = [];
            for (var j = 0; j < this.target_creature.total_num_pts * 3; j++) new_pts[j] = 0; 
            //auto new_pts = new glm::float32[target_creature->GetTotalNumPoints() * 3];
            this.PoseCreature(animation_name_in, new_pts);
            
            cache_pts_list.push(new_pts);
        }
        
        this.setRunTime(store_run_time);
};

// Fills up a single frame for a point cache animation
// Point caching is only enabled when the cache is FULLY filled up
// Remember the new filled cache is Appended onto the end of a list
// There is no indexing by time here so MAKE SURE this cache is filled up sequentially!
CreatureManager.prototype.FillSinglePointCacheFrame = function(animation_name_in, time_in)
{
	var store_run_time = this.getRunTime();
    var cur_animation = this.animations[animation_name_in];
	
	this.setRunTime(time_in);
    var new_pts = [];
    for (var j = 0; j < this.target_creature.total_num_pts * 3; j++) new_pts[j] = 0; 
    this.PoseCreature(animation_name_in, new_pts);
    
    cur_animation.fill_cache_pts.push(new_pts);
    cur_animation.verifyFillCache();

    this.setRunTime(store_run_time);
};

// Returns if animation is playing
CreatureManager.prototype.GetIsPlaying = function()
{
  return this.is_playing;
};

// Sets whether to loop the animation
CreatureManager.prototype.SetShouldLoop = function(flag_in)
{
	this.should_loop = flag_in;
};

// Sets whether to use a user defined custom time range for the currently
// active animation clip
CreatureManager.prototype.SetUseCustomTimeRange = function(flag_in)
{
	this.use_custom_time_range = flag_in;
};

// Sets the user defined custom time range
CreatureManager.prototype.SetCustomTimeRange = function(start_time_in, end_time_in)
{
	this.custom_start_time = start_time_in;
	this.custom_end_time = end_time_in;
};

// Sets whether the animation is playing
CreatureManager.prototype.SetIsPlaying = function(flag_in)
{
  this.is_playing = flag_in;
};

// Resets animation to start time
CreatureManager.prototype.ResetToStartTimes = function()
{
  var cur_animation = this.animations[active_animation_name];
  this.run_time = cur_animation.start_time;
};

// Sets the run time of the animation
CreatureManager.prototype.setRunTime = function(time_in)
{
  this.run_time = time_in;
  this.correctTime ();
};

// Increments the run time of the animation by a delta value
CreatureManager.prototype.increRunTime = function(delta_in)
{
  this.run_time += delta_in;
  this.correctTime ();
};

CreatureManager.prototype.correctTime = function()
{
  var cur_animation = this.animations[this.active_animation_name];
  var anim_start_time = cur_animation.start_time;
  var anim_end_time = cur_animation.end_time;
  
  if(this.use_custom_time_range)
  {
  	anim_start_time = this.custom_start_time;
  	anim_end_time = this.custom_end_time;
  }
  
  if(this.run_time > anim_end_time)
  {
  	if(this.should_loop)
  	{
    	this.run_time = anim_start_time;
    }
    else {
    	this.run_time = anim_end_time;
    }
  }
  else if(this.run_time < anim_start_time)
  {
  	if(this.should_loop)
  	{
    	this.run_time = anim_end_time;
    }
    else {
    	this.run_time = anim_start_time;	
    }
  }
};

// Returns the current run time of the animation
CreatureManager.prototype.getRunTime = function()
{
  return this.run_time;
};

// Runs a single step of the animation for a given delta timestep
CreatureManager.prototype.Update = function(delta)
{
  if(!this.is_playing)
  {
    return;
  }

  this.increRunTime(delta * this.time_scale);

  this.RunCreature ();
};

CreatureManager.prototype.RunAtTime = function(time_in)
{
  if(!this.is_playing)
  {
    return;
  }

  this.setRunTime(time_in);
  this.RunCreature ();
};

CreatureManager.prototype.RunCreature = function()
{
  if(this.do_blending)
  {
    for(var i = 0; i < 2; i++) {
      var cur_animation = this.animations[this.active_blend_animation_names[i]];
      if(cur_animation.cache_pts.length > 0)
      {
      	cur_animation.poseFromCachePts(this.getRunTime(), this.blend_render_pts[i], this.target_creature.total_num_pts);
      }
      else {
	  	this.PoseCreature(this.active_blend_animation_names[i], this.blend_render_pts[i]);
	  }
    }

    for(var j = 0; j < this.target_creature.total_num_pts * 3; j++)
    {
      var set_data_index = j;
      var read_data_1 = this.blend_render_pts[0][j];
      var read_data_2 = this.blend_render_pts[1][j];
      /*
         target_creature.render_pts[set_data_index] =
         ((1.0f - blending_factor) * (read_data_1)) +
         (blending_factor * (read_data_2));
       */
      this.target_creature.render_pts.set(set_data_index,
          ((1.0 - blending_factor) * (read_data_1)) +
          (blending_factor * (read_data_2)));

    }
  }
  else {
    var cur_animation = this.animations[this.active_animation_name];
    if(cur_animation.cache_pts.length > 0)
    {
    	cur_animation.poseFromCachePts(this.getRunTime(), this.target_creature.render_pts, this.target_creature.total_num_pts);
    	// cur_animation->poseFromCachePts(getRunTime(), target_creature->GetRenderPts(), target_creature->GetTotalNumPoints());
    }
    else {
		this.PoseCreature(this.active_animation_name, this.target_creature.render_pts);
	}
  }
};

// Sets scaling for time
CreatureManager.prototype.SetTimeScale = function(scale_in)
{
  this.time_scale = scale_in;
};

// Enables/Disables blending
CreatureManager.prototype.SetBlending = function(flag_in)
{
  this.do_blending = flag_in;

  if (this.do_blending) {
    if (this.blend_render_pts[0].length == 0) {
      var new_vec = [];
      for(var i = 0; i < target_creature.total_num_pts * 3; i++)
      {
        new_vec.push(0);
      }

      this.blend_render_pts.set(0, new_vec);
    }

    if (this.blend_render_pts[1].length == 0) {
      var new_vec = [];
      for(var i = 0; i < this.target_creature.total_num_pts * 3; i++)
      {
        new_vec.push(0);
      }

      this.blend_render_pts[1] = new_vec;
    }

  }
};

// Sets blending animation names
CreatureManager.prototype.SetBlendingAnimations = function(name_1, name_2)
{
  this.active_blend_animation_names[0] = name_1;
  this.active_blend_animation_names[1] = name_2;
};

// Sets the blending factor
CreatureManager.prototype.SetBlendingFactor = function(value_in)
{
  this.blending_factor = value_in;
};

// Given a set of coordinates in local creature space,
// see if any bone is in contact
CreatureManager.prototype.IsContactBone = function(pt_in, radius)
{
  var cur_bone = this.target_creature.render_composition.getRootBone();
  return this.ProcessContactBone(pt_in, radius, cur_bone);
};


CreatureManager.prototype.PoseCreature = function(animation_name_in, target_pts)
{
  var cur_animation = this.animations[animation_name_in];

  var bone_cache_manager = cur_animation.bones_cache;
  var displacement_cache_manager = cur_animation.displacement_cache;
  var uv_warp_cache_manager = cur_animation.uv_warp_cache;

  var render_composition =
    this.target_creature.render_composition;

  // Extract values from caches
  var bones_map =
    render_composition.getBonesMap();
  var regions_map =
    render_composition.getRegionsMap();

  bone_cache_manager.retrieveValuesAtTime(this.getRunTime(),
      bones_map);
      
  if(this.bones_override_callback != null)
  {
  	this.bones_override_callback(bones_map);
  }

  displacement_cache_manager.retrieveValuesAtTime(this.getRunTime(),
      regions_map);
  uv_warp_cache_manager.retrieveValuesAtTime(this.getRunTime(),
      regions_map);


  // Do posing, decide if we are blending or not
  var cur_regions =
    render_composition.getRegions();
  var cur_bones =
    render_composition.getBonesMap();

  render_composition.updateAllTransforms(false);
  for(var j = 0, l = cur_regions.length; j < l; j++) {
    var cur_region = cur_regions[j];

    var cur_pt_index = cur_region.getStartPtIndex();


    cur_region.poseFinalPts(target_pts,
        cur_pt_index * 3,
        cur_bones);

    // add in z offsets for different regions
    
    var start = cur_region.getStartPtIndex() * 3;
    var end = cur_region.getEndPtIndex() * 3;
    for(var k = start;
       k <= end;
       k+=3)
    {
       target_pts[k + 2] = -j * 0.001;
    }
     
  }
};

