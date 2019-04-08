/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Adapted from [gl-matrix](https://github.com/toji/gl-matrix) by toji
//  and [vecmath](https://github.com/mattdesl/vecmath) by mattdesl

var Class = require('../utils/Class');
var Vector3 = require('./Vector3');
var Matrix3 = require('./Matrix3');

var EPSILON = 0.000001;

//  Some shared 'private' arrays
var siNext = new Int8Array([ 1, 2, 0 ]);
var tmp = new Float32Array([ 0, 0, 0 ]);

var xUnitVec3 = new Vector3(1, 0, 0);
var yUnitVec3 = new Vector3(0, 1, 0);

var tmpvec = new Vector3();
var tmpMat3 = new Matrix3();

/**
 * @classdesc
 * A quaternion.
 *
 * @class Quaternion
 * @memberof Phaser.Math
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x] - The x component.
 * @param {number} [y] - The y component.
 * @param {number} [z] - The z component.
 * @param {number} [w] - The w component.
 */
var Quaternion = new Class({

    initialize:

    function Quaternion (x, y, z, w)
    {
        /**
         * The x component of this Quaternion.
         *
         * @name Phaser.Math.Quaternion#x
         * @type {number}
         * @default 0
         * @since 3.0.0
         */

        /**
         * The y component of this Quaternion.
         *
         * @name Phaser.Math.Quaternion#y
         * @type {number}
         * @default 0
         * @since 3.0.0
         */

        /**
         * The z component of this Quaternion.
         *
         * @name Phaser.Math.Quaternion#z
         * @type {number}
         * @default 0
         * @since 3.0.0
         */

        /**
         * The w component of this Quaternion.
         *
         * @name Phaser.Math.Quaternion#w
         * @type {number}
         * @default 0
         * @since 3.0.0
         */

        if (typeof x === 'object')
        {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
            this.w = x.w || 0;
        }
        else
        {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 0;
        }
    },

    /**
     * Copy the components of a given Quaternion or Vector into this Quaternion.
     *
     * @method Phaser.Math.Quaternion#copy
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Quaternion|Phaser.Math.Vector4)} src - The Quaternion or Vector to copy the components from.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    copy: function (src)
    {
        this.x = src.x;
        this.y = src.y;
        this.z = src.z;
        this.w = src.w;

        return this;
    },

    /**
     * Set the components of this Quaternion.
     *
     * @method Phaser.Math.Quaternion#set
     * @since 3.0.0
     *
     * @param {(number|object)} [x=0] - The x component, or an object containing x, y, z, and w components.
     * @param {number} [y=0] - The y component.
     * @param {number} [z=0] - The z component.
     * @param {number} [w=0] - The w component.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    set: function (x, y, z, w)
    {
        if (typeof x === 'object')
        {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
            this.w = x.w || 0;
        }
        else
        {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 0;
        }

        return this;
    },

    /**
     * Add a given Quaternion or Vector to this Quaternion. Addition is component-wise.
     *
     * @method Phaser.Math.Quaternion#add
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Quaternion|Phaser.Math.Vector4)} v - The Quaternion or Vector to add to this Quaternion.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    add: function (v)
    {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;

        return this;
    },

    /**
     * Subtract a given Quaternion or Vector from this Quaternion. Subtraction is component-wise.
     *
     * @method Phaser.Math.Quaternion#subtract
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Quaternion|Phaser.Math.Vector4)} v - The Quaternion or Vector to subtract from this Quaternion.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    subtract: function (v)
    {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;

        return this;
    },

    /**
     * Scale this Quaternion by the given value.
     *
     * @method Phaser.Math.Quaternion#scale
     * @since 3.0.0
     *
     * @param {number} scale - The value to scale this Quaternion by.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    scale: function (scale)
    {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        this.w *= scale;

        return this;
    },

    /**
     * Calculate the length of this Quaternion.
     *
     * @method Phaser.Math.Quaternion#length
     * @since 3.0.0
     *
     * @return {number} The length of this Quaternion.
     */
    length: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;

        return Math.sqrt(x * x + y * y + z * z + w * w);
    },

    /**
     * Calculate the length of this Quaternion squared.
     *
     * @method Phaser.Math.Quaternion#lengthSq
     * @since 3.0.0
     *
     * @return {number} The length of this Quaternion, squared.
     */
    lengthSq: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;

        return x * x + y * y + z * z + w * w;
    },

    /**
     * Normalize this Quaternion.
     *
     * @method Phaser.Math.Quaternion#normalize
     * @since 3.0.0
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    normalize: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;
        var len = x * x + y * y + z * z + w * w;

        if (len > 0)
        {
            len = 1 / Math.sqrt(len);

            this.x = x * len;
            this.y = y * len;
            this.z = z * len;
            this.w = w * len;
        }

        return this;
    },

    /**
     * Calculate the dot product of this Quaternion and the given Quaternion or Vector.
     *
     * @method Phaser.Math.Quaternion#dot
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Quaternion|Phaser.Math.Vector4)} v - The Quaternion or Vector to dot product with this Quaternion.
     *
     * @return {number} The dot product of this Quaternion and the given Quaternion or Vector.
     */
    dot: function (v)
    {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    },

    /**
     * Linearly interpolate this Quaternion towards the given Quaternion or Vector.
     *
     * @method Phaser.Math.Quaternion#lerp
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Quaternion|Phaser.Math.Vector4)} v - The Quaternion or Vector to interpolate towards.
     * @param {number} [t=0] - The percentage of interpolation.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    lerp: function (v, t)
    {
        if (t === undefined) { t = 0; }

        var ax = this.x;
        var ay = this.y;
        var az = this.z;
        var aw = this.w;

        this.x = ax + t * (v.x - ax);
        this.y = ay + t * (v.y - ay);
        this.z = az + t * (v.z - az);
        this.w = aw + t * (v.w - aw);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Quaternion#rotationTo
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} a - [description]
     * @param {Phaser.Math.Vector3} b - [description]
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    rotationTo: function (a, b)
    {
        var dot = a.x * b.x + a.y * b.y + a.z * b.z;

        if (dot < -0.999999)
        {
            if (tmpvec.copy(xUnitVec3).cross(a).length() < EPSILON)
            {
                tmpvec.copy(yUnitVec3).cross(a);
            }

            tmpvec.normalize();

            return this.setAxisAngle(tmpvec, Math.PI);

        }
        else if (dot > 0.999999)
        {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;

            return this;
        }
        else
        {
            tmpvec.copy(a).cross(b);

            this.x = tmpvec.x;
            this.y = tmpvec.y;
            this.z = tmpvec.z;
            this.w = 1 + dot;

            return this.normalize();
        }
    },

    /**
     * Set the axes of this Quaternion.
     *
     * @method Phaser.Math.Quaternion#setAxes
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} view - The view axis.
     * @param {Phaser.Math.Vector3} right - The right axis.
     * @param {Phaser.Math.Vector3} up - The upwards axis.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    setAxes: function (view, right, up)
    {
        var m = tmpMat3.val;

        m[0] = right.x;
        m[3] = right.y;
        m[6] = right.z;

        m[1] = up.x;
        m[4] = up.y;
        m[7] = up.z;

        m[2] = -view.x;
        m[5] = -view.y;
        m[8] = -view.z;

        return this.fromMat3(tmpMat3).normalize();
    },

    /**
     * Reset this Matrix to an identity (default) Quaternion.
     *
     * @method Phaser.Math.Quaternion#identity
     * @since 3.0.0
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    identity: function ()
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;

        return this;
    },

    /**
     * Set the axis angle of this Quaternion.
     *
     * @method Phaser.Math.Quaternion#setAxisAngle
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} axis - The axis.
     * @param {number} rad - The angle in radians.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    setAxisAngle: function (axis, rad)
    {
        rad = rad * 0.5;

        var s = Math.sin(rad);

        this.x = s * axis.x;
        this.y = s * axis.y;
        this.z = s * axis.z;
        this.w = Math.cos(rad);

        return this;
    },

    /**
     * Multiply this Quaternion by the given Quaternion or Vector.
     *
     * @method Phaser.Math.Quaternion#multiply
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Quaternion|Phaser.Math.Vector4)} b - The Quaternion or Vector to multiply this Quaternion by.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    multiply: function (b)
    {
        var ax = this.x;
        var ay = this.y;
        var az = this.z;
        var aw = this.w;

        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        var bw = b.w;

        this.x = ax * bw + aw * bx + ay * bz - az * by;
        this.y = ay * bw + aw * by + az * bx - ax * bz;
        this.z = az * bw + aw * bz + ax * by - ay * bx;
        this.w = aw * bw - ax * bx - ay * by - az * bz;

        return this;
    },

    /**
     * Smoothly linearly interpolate this Quaternion towards the given Quaternion or Vector.
     *
     * @method Phaser.Math.Quaternion#slerp
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Quaternion|Phaser.Math.Vector4)} b - The Quaternion or Vector to interpolate towards.
     * @param {number} t - The percentage of interpolation.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    slerp: function (b, t)
    {
        // benchmarks: http://jsperf.com/quaternion-slerp-implementations

        var ax = this.x;
        var ay = this.y;
        var az = this.z;
        var aw = this.w;

        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        var bw = b.w;

        // calc cosine
        var cosom = ax * bx + ay * by + az * bz + aw * bw;

        // adjust signs (if necessary)
        if (cosom < 0)
        {
            cosom = -cosom;
            bx = - bx;
            by = - by;
            bz = - bz;
            bw = - bw;
        }

        // "from" and "to" quaternions are very close
        //  ... so we can do a linear interpolation
        var scale0 = 1 - t;
        var scale1 = t;

        // calculate coefficients
        if ((1 - cosom) > EPSILON)
        {
            // standard case (slerp)
            var omega = Math.acos(cosom);
            var sinom = Math.sin(omega);

            scale0 = Math.sin((1.0 - t) * omega) / sinom;
            scale1 = Math.sin(t * omega) / sinom;
        }

        // calculate final values
        this.x = scale0 * ax + scale1 * bx;
        this.y = scale0 * ay + scale1 * by;
        this.z = scale0 * az + scale1 * bz;
        this.w = scale0 * aw + scale1 * bw;

        return this;
    },

    /**
     * Invert this Quaternion.
     *
     * @method Phaser.Math.Quaternion#invert
     * @since 3.0.0
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    invert: function ()
    {
        var a0 = this.x;
        var a1 = this.y;
        var a2 = this.z;
        var a3 = this.w;

        var dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
        var invDot = (dot) ? 1 / dot : 0;

        // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

        this.x = -a0 * invDot;
        this.y = -a1 * invDot;
        this.z = -a2 * invDot;
        this.w = a3 * invDot;

        return this;
    },

    /**
     * Convert this Quaternion into its conjugate.
     *
     * Sets the x, y and z components.
     *
     * @method Phaser.Math.Quaternion#conjugate
     * @since 3.0.0
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    conjugate: function ()
    {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;

        return this;
    },

    /**
     * Rotate this Quaternion on the X axis.
     *
     * @method Phaser.Math.Quaternion#rotateX
     * @since 3.0.0
     *
     * @param {number} rad - The rotation angle in radians.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    rotateX: function (rad)
    {
        rad *= 0.5;

        var ax = this.x;
        var ay = this.y;
        var az = this.z;
        var aw = this.w;

        var bx = Math.sin(rad);
        var bw = Math.cos(rad);

        this.x = ax * bw + aw * bx;
        this.y = ay * bw + az * bx;
        this.z = az * bw - ay * bx;
        this.w = aw * bw - ax * bx;

        return this;
    },

    /**
     * Rotate this Quaternion on the Y axis.
     *
     * @method Phaser.Math.Quaternion#rotateY
     * @since 3.0.0
     *
     * @param {number} rad - The rotation angle in radians.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    rotateY: function (rad)
    {
        rad *= 0.5;

        var ax = this.x;
        var ay = this.y;
        var az = this.z;
        var aw = this.w;

        var by = Math.sin(rad);
        var bw = Math.cos(rad);

        this.x = ax * bw - az * by;
        this.y = ay * bw + aw * by;
        this.z = az * bw + ax * by;
        this.w = aw * bw - ay * by;

        return this;
    },

    /**
     * Rotate this Quaternion on the Z axis.
     *
     * @method Phaser.Math.Quaternion#rotateZ
     * @since 3.0.0
     *
     * @param {number} rad - The rotation angle in radians.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    rotateZ: function (rad)
    {
        rad *= 0.5;

        var ax = this.x;
        var ay = this.y;
        var az = this.z;
        var aw = this.w;

        var bz = Math.sin(rad);
        var bw = Math.cos(rad);

        this.x = ax * bw + ay * bz;
        this.y = ay * bw - ax * bz;
        this.z = az * bw + aw * bz;
        this.w = aw * bw - az * bz;

        return this;
    },

    /**
     * Create a unit (or rotation) Quaternion from its x, y, and z components.
     *
     * Sets the w component.
     *
     * @method Phaser.Math.Quaternion#calculateW
     * @since 3.0.0
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    calculateW: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        this.w = -Math.sqrt(1.0 - x * x - y * y - z * z);

        return this;
    },

    /**
     * Convert the given Matrix into this Quaternion.
     *
     * @method Phaser.Math.Quaternion#fromMat3
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix3} mat - The Matrix to convert from.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    fromMat3: function (mat)
    {
        // benchmarks:
        //    http://jsperf.com/typed-array-access-speed
        //    http://jsperf.com/conversion-of-3x3-matrix-to-quaternion

        // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
        // article "Quaternion Calculus and Fast Animation".
        var m = mat.val;
        var fTrace = m[0] + m[4] + m[8];
        var fRoot;

        if (fTrace > 0)
        {
            // |w| > 1/2, may as well choose w > 1/2
            fRoot = Math.sqrt(fTrace + 1.0); // 2w

            this.w = 0.5 * fRoot;

            fRoot = 0.5 / fRoot; // 1/(4w)

            this.x = (m[7] - m[5]) * fRoot;
            this.y = (m[2] - m[6]) * fRoot;
            this.z = (m[3] - m[1]) * fRoot;
        }
        else
        {
            // |w| <= 1/2
            var i = 0;

            if (m[4] > m[0])
            {
                i = 1;
            }

            if (m[8] > m[i * 3 + i])
            {
                i = 2;
            }

            var j = siNext[i];
            var k = siNext[j];

            //  This isn't quite as clean without array access
            fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
            tmp[i] = 0.5 * fRoot;

            fRoot = 0.5 / fRoot;

            tmp[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
            tmp[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;

            this.x = tmp[0];
            this.y = tmp[1];
            this.z = tmp[2];
            this.w = (m[k * 3 + j] - m[j * 3 + k]) * fRoot;
        }

        return this;
    }

});

module.exports = Quaternion;
