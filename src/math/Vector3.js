/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Adapted from [gl-matrix](https://github.com/toji/gl-matrix) by toji
//  and [vecmath](https://github.com/mattdesl/vecmath) by mattdesl

var Class = require('../utils/Class');

/**
 * @classdesc
 * [description]
 *
 * @class Vector3
 * @memberOf Phaser.Math
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x] - [description]
 * @param {number} [y] - [description]
 * @param {number} [z] - [description]
 */
var Vector3 = new Class({

    initialize:

    function Vector3 (x, y, z)
    {
        /**
         * The x component of this Vector.
         *
         * @name Phaser.Math.Vector3#x
         * @type {number}
         * @default 0
         * @since 3.0.0
         */

        /**
         * The y component of this Vector.
         *
         * @name Phaser.Math.Vector3#y
         * @type {number}
         * @default 0
         * @since 3.0.0
         */

        /**
         * The z component of this Vector.
         *
         * @name Phaser.Math.Vector3#z
         * @type {number}
         * @default 0
         * @since 3.0.0
         */

        if (typeof x === 'object')
        {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
        }
        else
        {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#up
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector3} This Vector3 object.
     */
    up: function ()
    {
        this.x = 0;
        this.y = 1;
        this.z = 0;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#clone
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector3} A new Vector3 object containing this Vectors values.
     */
    clone: function ()
    {
        return new Vector3(this.x, this.y, this.z);
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#crossVectors
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} a - [description]
     * @param {Phaser.Math.Vector3} b - [description]
     *
     * @return {Phaser.Math.Vector3} This Vector3 object.
     */
    crossVectors: function (a, b)
    {
        var ax = a.x;
        var ay = a.y;
        var az = a.z;
        var bx = b.x;
        var by = b.y;
        var bz = b.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#equals
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} v - The Vector3 to compare against.
     *
     * @return {boolean} True if the two vectors strictly match, otherwise false.
     */
    equals: function (v)
    {
        return ((this.x === v.x) && (this.y === v.y) && (this.z === v.z));
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#copy
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3)} src - [description]
     *
     * @return {Phaser.Math.Vector3} This Vector3 object.
     */
    copy: function (src)
    {
        this.x = src.x;
        this.y = src.y;
        this.z = src.z || 0;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#set
     * @since 3.0.0
     *
     * @param {(number|object)} x - [description]
     * @param {number} [y] - [description]
     * @param {number} [z] - [description]
     *
     * @return {Phaser.Math.Vector3} This Vector3 object.
     */
    set: function (x, y, z)
    {
        if (typeof x === 'object')
        {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
        }
        else
        {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#add
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3)} v - [description]
     *
     * @return {Phaser.Math.Vector3} This Vector3 object.
     */
    add: function (v)
    {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z || 0;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#subtract
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3)} v - [description]
     *
     * @return {Phaser.Math.Vector3} This Vector3 object.
     */
    subtract: function (v)
    {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z || 0;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#multiply
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3)} v - [description]
     *
     * @return {Phaser.Math.Vector3} This Vector3 object.
     */
    multiply: function (v)
    {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z || 1;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#scale
     * @since 3.0.0
     *
     * @param {float} scale - [description]
     *
     * @return {Phaser.Math.Vector3} This Vector3 object.
     */
    scale: function (scale)
    {
        if (isFinite(scale))
        {
            this.x *= scale;
            this.y *= scale;
            this.z *= scale;
        }
        else
        {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#divide
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3)} v - [description]
     *
     * @return {Phaser.Math.Vector3} This Vector3 object.
     */
    divide: function (v)
    {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z || 1;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#negate
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector3} This Vector3 object.
     */
    negate: function ()
    {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#distance
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3)} v - [description]
     *
     * @return {number} [description]
     */
    distance: function (v)
    {
        var dx = v.x - this.x;
        var dy = v.y - this.y;
        var dz = v.z - this.z || 0;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#distanceSq
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3)} v - [description]
     *
     * @return {number} [description]
     */
    distanceSq: function (v)
    {
        var dx = v.x - this.x;
        var dy = v.y - this.y;
        var dz = v.z - this.z || 0;

        return dx * dx + dy * dy + dz * dz;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#length
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    length: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        return Math.sqrt(x * x + y * y + z * z);
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#lengthSq
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    lengthSq: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        return x * x + y * y + z * z;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#normalize
     * @since 3.0.0
     *
     * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3)} v - [description]
     *
     * @return {Phaser.Math.Vector3} This Vector3 object.
     */
    normalize: function ()
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var len = x * x + y * y + z * z;

        if (len > 0)
        {
            len = 1 / Math.sqrt(len);

            this.x = x * len;
            this.y = y * len;
            this.z = z * len;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#dot
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} v - [description]
     *
     * @return {number} [description]
     */
    dot: function (v)
    {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#cross
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} v - [description]
     *
     * @return {Phaser.Math.Vector3} This Vector3 object.
     */
    cross: function (v)
    {
        var ax = this.x;
        var ay = this.y;
        var az = this.z;
        var bx = v.x;
        var by = v.y;
        var bz = v.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#lerp
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} v - [description]
     * @param {number} [t=0] - [description]
     *
     * @return {Phaser.Math.Vector3} This Vector3 object.
     */
    lerp: function (v, t)
    {
        if (t === undefined) { t = 0; }

        var ax = this.x;
        var ay = this.y;
        var az = this.z;

        this.x = ax + t * (v.x - ax);
        this.y = ay + t * (v.y - ay);
        this.z = az + t * (v.z - az);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#transformMat3
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix3} mat - [description]
     *
     * @return {Phaser.Math.Vector3} This Vector3 object.
     */
    transformMat3: function (mat)
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var m = mat.val;

        this.x = x * m[0] + y * m[3] + z * m[6];
        this.y = x * m[1] + y * m[4] + z * m[7];
        this.z = x * m[2] + y * m[5] + z * m[8];

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#transformMat4
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix4} mat - [description]
     *
     * @return {Phaser.Math.Vector3} This Vector3 object.
     */
    transformMat4: function (mat)
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var m = mat.val;

        this.x = m[0] * x + m[4] * y + m[8] * z + m[12];
        this.y = m[1] * x + m[5] * y + m[9] * z + m[13];
        this.z = m[2] * x + m[6] * y + m[10] * z + m[14];

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#transformCoordinates
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix4} mat - [description]
     *
     * @return {Phaser.Math.Vector3} This Vector3 object.
     */
    transformCoordinates: function (mat)
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var m = mat.val;

        var tx = (x * m[0]) + (y * m[4]) + (z * m[8]) + m[12];
        var ty = (x * m[1]) + (y * m[5]) + (z * m[9]) + m[13];
        var tz = (x * m[2]) + (y * m[6]) + (z * m[10]) + m[14];
        var tw = (x * m[3]) + (y * m[7]) + (z * m[11]) + m[15];

        this.x = tx / tw;
        this.y = ty / tw;
        this.z = tz / tw;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#transformQuat
     * @since 3.0.0
     *
     * @param {Phaser.Math.Quaternion} q - [description]
     *
     * @return {Phaser.Math.Vector3} This Vector3 object.
     */
    transformQuat: function (q)
    {
        // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var qx = q.x;
        var qy = q.y;
        var qz = q.z;
        var qw = q.w;

        // calculate quat * vec
        var ix = qw * x + qy * z - qz * y;
        var iy = qw * y + qz * x - qx * z;
        var iz = qw * z + qx * y - qy * x;
        var iw = -qx * x - qy * y - qz * z;

        // calculate result * inverse quat
        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

        return this;
    },

    /**
     * Multiplies this Vector3 by the specified matrix, applying a W divide. This is useful for projection,
     * e.g. unprojecting a 2D point into 3D space.
     *
     * @method Phaser.Math.Vector3#project
     * @since 3.0.0
     *
     * @param {Phaser.Math.Matrix4} mat - [description]
     *
     * @return {Phaser.Math.Vector3} This Vector3 object.
     */
    project: function (mat)
    {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var m = mat.val;

        var a00 = m[0];
        var a01 = m[1];
        var a02 = m[2];
        var a03 = m[3];
        var a10 = m[4];
        var a11 = m[5];
        var a12 = m[6];
        var a13 = m[7];
        var a20 = m[8];
        var a21 = m[9];
        var a22 = m[10];
        var a23 = m[11];
        var a30 = m[12];
        var a31 = m[13];
        var a32 = m[14];
        var a33 = m[15];

        var lw = 1 / (x * a03 + y * a13 + z * a23 + a33);

        this.x = (x * a00 + y * a10 + z * a20 + a30) * lw;
        this.y = (x * a01 + y * a11 + z * a21 + a31) * lw;
        this.z = (x * a02 + y * a12 + z * a22 + a32) * lw;

        return this;
    },

    /**
     * Unproject this point from 2D space to 3D space.
     * The point should have its x and y properties set to
     * 2D screen space, and the z either at 0 (near plane)
     * or 1 (far plane). The provided matrix is assumed to already
     * be combined, i.e. projection * view * model.
     *
     * After this operation, this vector's (x, y, z) components will
     * represent the unprojected 3D coordinate.
     *
     * @method Phaser.Math.Vector3#unproject
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector4} viewport - Screen x, y, width and height in pixels.
     * @param {Phaser.Math.Matrix4} invProjectionView - Combined projection and view matrix.
     *
     * @return {Phaser.Math.Vector3} This Vector3 object.
     */
    unproject: function (viewport, invProjectionView)
    {
        var viewX = viewport.x;
        var viewY = viewport.y;
        var viewWidth = viewport.z;
        var viewHeight = viewport.w;

        var x = this.x - viewX;
        var y = (viewHeight - this.y - 1) - viewY;
        var z = this.z;

        this.x = (2 * x) / viewWidth - 1;
        this.y = (2 * y) / viewHeight - 1;
        this.z = 2 * z - 1;

        return this.project(invProjectionView);
    },

    /**
     * [description]
     *
     * @method Phaser.Math.Vector3#reset
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector3} This Vector3 object.
     */
    reset: function ()
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;

        return this;
    }

});

/*
Vector3.Zero = function ()
{
    return new Vector3(0, 0, 0);
};

Vector3.Up = function ()
{
    return new Vector3(0, 1.0, 0);
};

Vector3.Copy = function (source)
{
    return new Vector3(source.x, source.y, source.z);
};

Vector3.TransformCoordinates = function (vector, transformation)
{
    var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]) + transformation.m[12];
    var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]) + transformation.m[13];
    var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]) + transformation.m[14];
    var w = (vector.x * transformation.m[3]) + (vector.y * transformation.m[7]) + (vector.z * transformation.m[11]) + transformation.m[15];

    return new Vector3(x / w, y / w, z / w);
};

Vector3.TransformNormal = function (vector, transformation)
{
    var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]);
    var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]);
    var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]);

    return new Vector3(x, y, z);
};

Vector3.Dot = function (left, right)
{
    return (left.x * right.x + left.y * right.y + left.z * right.z);
};

Vector3.Cross = function (left, right)
{
    var x = left.y * right.z - left.z * right.y;
    var y = left.z * right.x - left.x * right.z;
    var z = left.x * right.y - left.y * right.x;

    return new Vector3(x, y, z);
};

Vector3.Normalize = function (vector)
{
    var newVector = Vector3.Copy(vector);
    newVector.normalize();

    return newVector;
};

Vector3.Distance = function (value1, value2)
{
    return Math.sqrt(Vector3.DistanceSquared(value1, value2));
};

Vector3.DistanceSquared = function (value1, value2)
{
    var x = value1.x - value2.x;
    var y = value1.y - value2.y;
    var z = value1.z - value2.z;

    return (x * x) + (y * y) + (z * z);
};
*/

module.exports = Vector3;
