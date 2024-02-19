/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  Adapted from [gl-matrix](https://github.com/toji/gl-matrix) by toji
//  and [vecmath](https://github.com/mattdesl/vecmath) by mattdesl

var Class = require('../utils/Class');
var Matrix3 = require('./Matrix3');
var NOOP = require('../utils/NOOP');
var Vector3 = require('./Vector3');

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
 * @param {number} [x=0] - The x component.
 * @param {number} [y=0] - The y component.
 * @param {number} [z=0] - The z component.
 * @param {number} [w=1] - The w component.
 */
var Quaternion = new Class({

    initialize:

    function Quaternion (x, y, z, w)
    {
        /**
         * The x component of this Quaternion.
         *
         * @name Phaser.Math.Quaternion#_x
         * @type {number}
         * @default 0
         * @private
         * @since 3.50.0
         */

        /**
         * The y component of this Quaternion.
         *
         * @name Phaser.Math.Quaternion#_y
         * @type {number}
         * @default 0
         * @private
         * @since 3.50.0
         */

        /**
         * The z component of this Quaternion.
         *
         * @name Phaser.Math.Quaternion#_z
         * @type {number}
         * @default 0
         * @private
         * @since 3.50.0
         */

        /**
         * The w component of this Quaternion.
         *
         * @name Phaser.Math.Quaternion#_w
         * @type {number}
         * @default 0
         * @private
         * @since 3.50.0
         */

        /**
         * This callback is invoked, if set, each time a value in this quaternion is changed.
         * The callback is passed one argument, a reference to this quaternion.
         *
         * @name Phaser.Math.Quaternion#onChangeCallback
         * @type {function}
         * @since 3.50.0
         */
        this.onChangeCallback = NOOP;

        this.set(x, y, z, w);
    },

    /**
     * The x component of this Quaternion.
     *
     * @name Phaser.Math.Quaternion#x
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    x: {
        get: function ()
        {
            return this._x;
        },

        set: function (value)
        {
            this._x = value;

            this.onChangeCallback(this);
        }
    },

    /**
     * The y component of this Quaternion.
     *
     * @name Phaser.Math.Quaternion#y
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    y: {
        get: function ()
        {
            return this._y;
        },

        set: function (value)
        {
            this._y = value;

            this.onChangeCallback(this);
        }
    },

    /**
     * The z component of this Quaternion.
     *
     * @name Phaser.Math.Quaternion#z
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    z: {
        get: function ()
        {
            return this._z;
        },

        set: function (value)
        {
            this._z = value;

            this.onChangeCallback(this);
        }
    },

    /**
     * The w component of this Quaternion.
     *
     * @name Phaser.Math.Quaternion#w
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    w: {
        get: function ()
        {
            return this._w;
        },

        set: function (value)
        {
            this._w = value;

            this.onChangeCallback(this);
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
        return this.set(src);
    },

    /**
     * Set the components of this Quaternion and optionally call the `onChangeCallback`.
     *
     * @method Phaser.Math.Quaternion#set
     * @since 3.0.0
     *
     * @param {(number|object)} [x=0] - The x component, or an object containing x, y, z, and w components.
     * @param {number} [y=0] - The y component.
     * @param {number} [z=0] - The z component.
     * @param {number} [w=0] - The w component.
     * @param {boolean} [update=true] - Call the `onChangeCallback`?
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    set: function (x, y, z, w, update)
    {
        if (update === undefined) { update = true; }

        if (typeof x === 'object')
        {
            this._x = x.x || 0;
            this._y = x.y || 0;
            this._z = x.z || 0;
            this._w = x.w || 0;
        }
        else
        {
            this._x = x || 0;
            this._y = y || 0;
            this._z = z || 0;
            this._w = w || 0;
        }

        if (update)
        {
            this.onChangeCallback(this);
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
        this._x += v.x;
        this._y += v.y;
        this._z += v.z;
        this._w += v.w;

        this.onChangeCallback(this);

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
        this._x -= v.x;
        this._y -= v.y;
        this._z -= v.z;
        this._w -= v.w;

        this.onChangeCallback(this);

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
        this._x *= scale;
        this._y *= scale;
        this._z *= scale;
        this._w *= scale;

        this.onChangeCallback(this);

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

            this._x = x * len;
            this._y = y * len;
            this._z = z * len;
            this._w = w * len;
        }

        this.onChangeCallback(this);

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

        return this.set(
            ax + t * (v.x - ax),
            ay + t * (v.y - ay),
            az + t * (v.z - az),
            aw + t * (v.w - aw)
        );
    },

    /**
     * Rotates this Quaternion based on the two given vectors.
     *
     * @method Phaser.Math.Quaternion#rotationTo
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector3} a - The transform rotation vector.
     * @param {Phaser.Math.Vector3} b - The target rotation vector.
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
            return this.set(0, 0, 0, 1);
        }
        else
        {
            tmpvec.copy(a).cross(b);

            this._x = tmpvec.x;
            this._y = tmpvec.y;
            this._z = tmpvec.z;
            this._w = 1 + dot;

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
        return this.set(0, 0, 0, 1);
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

        return this.set(
            s * axis.x,
            s * axis.y,
            s * axis.z,
            Math.cos(rad)
        );
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

        return this.set(
            ax * bw + aw * bx + ay * bz - az * by,
            ay * bw + aw * by + az * bx - ax * bz,
            az * bw + aw * bz + ax * by - ay * bx,
            aw * bw - ax * bx - ay * by - az * bz
        );
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
        return this.set(
            scale0 * ax + scale1 * bx,
            scale0 * ay + scale1 * by,
            scale0 * az + scale1 * bz,
            scale0 * aw + scale1 * bw
        );
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

        return this.set(
            -a0 * invDot,
            -a1 * invDot,
            -a2 * invDot,
            a3 * invDot
        );
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
        this._x = -this.x;
        this._y = -this.y;
        this._z = -this.z;

        this.onChangeCallback(this);

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

        return this.set(
            ax * bw + aw * bx,
            ay * bw + az * bx,
            az * bw - ay * bx,
            aw * bw - ax * bx
        );
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

        return this.set(
            ax * bw - az * by,
            ay * bw + aw * by,
            az * bw + ax * by,
            aw * bw - ay * by
        );
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

        return this.set(
            ax * bw + ay * bz,
            ay * bw - ax * bz,
            az * bw + aw * bz,
            aw * bw - az * bz
        );
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
     * Set this Quaternion from the given Euler, based on Euler order.
     *
     * @method Phaser.Math.Quaternion#setFromEuler
     * @since 3.50.0
     *
     * @param {Phaser.Math.Euler} euler - The Euler to convert from.
     * @param {boolean} [update=true] - Run the `onChangeCallback`?
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    setFromEuler: function (euler, update)
    {
        var x = euler.x / 2;
        var y = euler.y / 2;
        var z = euler.z / 2;

        var c1 = Math.cos(x);
        var c2 = Math.cos(y);
        var c3 = Math.cos(z);

        var s1 = Math.sin(x);
        var s2 = Math.sin(y);
        var s3 = Math.sin(z);

        switch (euler.order)
        {
            case 'XYZ':
            {
                this.set(
                    s1 * c2 * c3 + c1 * s2 * s3,
                    c1 * s2 * c3 - s1 * c2 * s3,
                    c1 * c2 * s3 + s1 * s2 * c3,
                    c1 * c2 * c3 - s1 * s2 * s3,
                    update
                );

                break;
            }

            case 'YXZ':
            {
                this.set(
                    s1 * c2 * c3 + c1 * s2 * s3,
                    c1 * s2 * c3 - s1 * c2 * s3,
                    c1 * c2 * s3 - s1 * s2 * c3,
                    c1 * c2 * c3 + s1 * s2 * s3,
                    update
                );

                break;
            }

            case 'ZXY':
            {
                this.set(
                    s1 * c2 * c3 - c1 * s2 * s3,
                    c1 * s2 * c3 + s1 * c2 * s3,
                    c1 * c2 * s3 + s1 * s2 * c3,
                    c1 * c2 * c3 - s1 * s2 * s3,
                    update
                );

                break;
            }

            case 'ZYX':
            {
                this.set(
                    s1 * c2 * c3 - c1 * s2 * s3,
                    c1 * s2 * c3 + s1 * c2 * s3,
                    c1 * c2 * s3 - s1 * s2 * c3,
                    c1 * c2 * c3 + s1 * s2 * s3,
                    update
                );

                break;
            }

            case 'YZX':
            {
                this.set(
                    s1 * c2 * c3 + c1 * s2 * s3,
                    c1 * s2 * c3 + s1 * c2 * s3,
                    c1 * c2 * s3 - s1 * s2 * c3,
                    c1 * c2 * c3 - s1 * s2 * s3,
                    update
                );

                break;
            }

            case 'XZY':
            {
                this.set(
                    s1 * c2 * c3 - c1 * s2 * s3,
                    c1 * s2 * c3 - s1 * c2 * s3,
                    c1 * c2 * s3 + s1 * s2 * c3,
                    c1 * c2 * c3 + s1 * s2 * s3,
                    update
                );

                break;
            }
        }

        return this;
    },

    /**
     * Sets the rotation of this Quaternion from the given Matrix4.
     *
     * @method Phaser.Math.Quaternion#setFromRotationMatrix
     * @since 3.50.0
     *
     * @param {Phaser.Math.Matrix4} mat4 - The Matrix4 to set the rotation from.
     *
     * @return {Phaser.Math.Quaternion} This Quaternion.
     */
    setFromRotationMatrix: function (mat4)
    {
        var m = mat4.val;

        var m11 = m[0];
        var m12 = m[4];
        var m13 = m[8];
        var m21 = m[1];
        var m22 = m[5];
        var m23 = m[9];
        var m31 = m[2];
        var m32 = m[6];
        var m33 = m[10];

        var trace = m11 + m22 + m33;
        var s;

        if (trace > 0)
        {
            s = 0.5 / Math.sqrt(trace + 1.0);

            this.set(
                (m32 - m23) * s,
                (m13 - m31) * s,
                (m21 - m12) * s,
                0.25 / s
            );
        }
        else if (m11 > m22 && m11 > m33)
        {
            s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

            this.set(
                0.25 * s,
                (m12 + m21) / s,
                (m13 + m31) / s,
                (m32 - m23) / s
            );
        }
        else if (m22 > m33)
        {
            s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

            this.set(
                (m12 + m21) / s,
                0.25 * s,
                (m23 + m32) / s,
                (m13 - m31) / s
            );
        }
        else
        {
            s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

            this.set(
                (m13 + m31) / s,
                (m23 + m32) / s,
                0.25 * s,
                (m21 - m12) / s
            );
        }

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

            this._x = (m[7] - m[5]) * fRoot;
            this._y = (m[2] - m[6]) * fRoot;
            this._z = (m[3] - m[1]) * fRoot;
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

            this._x = tmp[0];
            this._y = tmp[1];
            this._z = tmp[2];
            this._w = (m[k * 3 + j] - m[j * 3 + k]) * fRoot;
        }

        this.onChangeCallback(this);

        return this;
    }

});

module.exports = Quaternion;
