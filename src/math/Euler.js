/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Clamp = require('./Clamp');
var Class = require('../utils/Class');
var Matrix4 = require('./Matrix4');
var NOOP = require('../utils/NOOP');

var tempMatrix = new Matrix4();

/**
 * @classdesc
 * Represents a set of Euler angles (rotation around X, Y, and Z axes) used for 3D rotations.
 * Euler angles describe orientation using three successive rotations around the coordinate axes.
 * The `order` property defines which axes and in what sequence the rotations are applied
 * (e.g., 'XYZ' applies rotation around X first, then Y, then Z).
 *
 * @class Euler
 * @memberof Phaser.Math
 * @constructor
 * @since 3.50.0
 *
 * @param {number} [x=0] - The rotation around the X axis, in radians.
 * @param {number} [y=0] - The rotation around the Y axis, in radians.
 * @param {number} [z=0] - The rotation around the Z axis, in radians.
 * @param {string} [order='XYZ'] - The order in which rotations are applied. One of 'XYZ', 'YXZ', 'ZXY', 'ZYX', 'YZX', or 'XZY'.
 */
var Euler = new Class({

    initialize:

    function Euler (x, y, z, order)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (z === undefined) { z = 0; }
        if (order === undefined) { order = Euler.DefaultOrder; }

        this._x = x;
        this._y = y;
        this._z = z;
        this._order = order;

        this.onChangeCallback = NOOP;
    },

    /**
     * The rotation around the X axis, in radians.
     *
     * Setting this property will invoke the `onChangeCallback`, if one has been set.
     *
     * @name Phaser.Math.Euler#x
     * @type {number}
     * @since 3.50.0
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
     * The rotation around the Y axis, in radians.
     *
     * Setting this property will invoke the `onChangeCallback`, if one has been set.
     *
     * @name Phaser.Math.Euler#y
     * @type {number}
     * @since 3.50.0
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
     * The rotation around the Z axis, in radians.
     *
     * Setting this property will invoke the `onChangeCallback`, if one has been set.
     *
     * @name Phaser.Math.Euler#z
     * @type {number}
     * @since 3.50.0
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
     * The rotation order used when applying Euler angles. Determines the sequence in which
     * rotations around the X, Y, and Z axes are applied. Must be one of:
     * 'XYZ', 'YXZ', 'ZXY', 'ZYX', 'YZX', or 'XZY'.
     *
     * Setting this property will invoke the `onChangeCallback`, if one has been set.
     *
     * @name Phaser.Math.Euler#order
     * @type {string}
     * @since 3.50.0
     */
    order: {
        get: function ()
        {
            return this._order;
        },

        set: function (value)
        {
            this._order = value;

            this.onChangeCallback(this);
        }
    },

    /**
     * Sets the X, Y, Z, and order components of this Euler angle simultaneously.
     *
     * After updating all internal values, `onChangeCallback` is invoked with this Euler
     * instance as the argument.
     *
     * @method Phaser.Math.Euler#set
     * @since 3.50.0
     *
     * @param {number} x - The rotation around the X axis, in radians.
     * @param {number} y - The rotation around the Y axis, in radians.
     * @param {number} z - The rotation around the Z axis, in radians.
     * @param {string} [order] - The rotation order. Defaults to the current order if not specified.
     *
     * @return {Phaser.Math.Euler} This Euler instance.
     */
    set: function (x, y, z, order)
    {
        if (order === undefined) { order = this._order; }

        this._x = x;
        this._y = y;
        this._z = z;
        this._order = order;

        this.onChangeCallback(this);

        return this;
    },

    /**
     * Copies the X, Y, Z, and order properties from another Euler instance into this one.
     *
     * @method Phaser.Math.Euler#copy
     * @since 3.50.0
     *
     * @param {Phaser.Math.Euler} euler - The Euler instance to copy from.
     *
     * @return {Phaser.Math.Euler} This Euler instance.
     */
    copy: function (euler)
    {
        return this.set(euler.x, euler.y, euler.z, euler.order);
    },

    /**
     * Sets the Euler angles from a Quaternion, using the specified rotation order.
     *
     * The quaternion is first converted to a rotation matrix internally, then
     * `setFromRotationMatrix` is called to derive the Euler angles. This avoids
     * gimbal lock issues by working through the matrix representation.
     *
     * @method Phaser.Math.Euler#setFromQuaternion
     * @since 3.50.0
     *
     * @param {Phaser.Math.Quaternion} quaternion - The quaternion to derive Euler angles from.
     * @param {string} [order] - The rotation order to use. Defaults to the current order if not specified.
     * @param {boolean} [update=false] - Whether to invoke `onChangeCallback` after setting the values.
     *
     * @return {Phaser.Math.Euler} This Euler instance.
     */
    setFromQuaternion: function (quaternion, order, update)
    {
        if (order === undefined) { order = this._order; }
        if (update === undefined) { update = false; }

        tempMatrix.fromQuat(quaternion);

        return this.setFromRotationMatrix(tempMatrix, order, update);
    },

    /**
     * Sets the Euler angles from the upper-left 3x3 rotation portion of a 4x4 Matrix4,
     * using the specified rotation order.
     *
     * The matrix is assumed to be a pure rotation matrix (un-scaled). Each supported
     * rotation order has its own decomposition formula. If the `update` parameter is
     * `true`, `onChangeCallback` is invoked after the values are set.
     *
     * @method Phaser.Math.Euler#setFromRotationMatrix
     * @since 3.50.0
     *
     * @param {Phaser.Math.Matrix4} matrix - The rotation matrix to derive Euler angles from. Must be a pure (un-scaled) rotation matrix.
     * @param {string} [order] - The rotation order to use. Defaults to the current order if not specified.
     * @param {boolean} [update=false] - Whether to invoke `onChangeCallback` after setting the values.
     *
     * @return {Phaser.Math.Euler} This Euler instance.
     */
    setFromRotationMatrix: function (matrix, order, update)
    {
        if (order === undefined) { order = this._order; }
        if (update === undefined) { update = false; }

        var elements = matrix.val;

        //  Upper 3x3 of matrix is un-scaled rotation matrix
        var m11 = elements[0];
        var m12 = elements[4];
        var m13 = elements[8];
        var m21 = elements[1];
        var m22 = elements[5];
        var m23 = elements[9];
        var m31 = elements[2];
        var m32 = elements[6];
        var m33 = elements[10];

        var x = 0;
        var y = 0;
        var z = 0;
        var epsilon = 0.99999;

        switch (order)
        {
            case 'XYZ':
            {
                y = Math.asin(Clamp(m13, -1, 1));

                if (Math.abs(m13) < epsilon)
                {
                    x = Math.atan2(-m23, m33);
                    z = Math.atan2(-m12, m11);
                }
                else
                {
                    x = Math.atan2(m32, m22);
                }

                break;
            }

            case 'YXZ':
            {
                x = Math.asin(-Clamp(m23, -1, 1));

                if (Math.abs(m23) < epsilon)
                {
                    y = Math.atan2(m13, m33);
                    z = Math.atan2(m21, m22);
                }
                else
                {
                    y = Math.atan2(-m31, m11);
                }

                break;
            }

            case 'ZXY':
            {
                x = Math.asin(Clamp(m32, -1, 1));

                if (Math.abs(m32) < epsilon)
                {
                    y = Math.atan2(-m31, m33);
                    z = Math.atan2(-m12, m22);
                }
                else
                {
                    z = Math.atan2(m21, m11);
                }

                break;
            }

            case 'ZYX':
            {
                y = Math.asin(-Clamp(m31, -1, 1));

                if (Math.abs(m31) < epsilon)
                {
                    x = Math.atan2(m32, m33);
                    z = Math.atan2(m21, m11);
                }
                else
                {
                    z = Math.atan2(-m12, m22);
                }

                break;
            }

            case 'YZX':
            {
                z = Math.asin(Clamp(m21, -1, 1));

                if (Math.abs(m21) < epsilon)
                {
                    x = Math.atan2(-m23, m22);
                    y = Math.atan2(-m31, m11);
                }
                else
                {
                    y = Math.atan2(m13, m33);
                }

                break;
            }

            case 'XZY':
            {
                z = Math.asin(-Clamp(m12, -1, 1));

                if (Math.abs(m12) < epsilon)
                {
                    x = Math.atan2(m32, m22);
                    y = Math.atan2(m13, m11);
                }
                else
                {
                    x = Math.atan2(-m23, m33);
                }

                break;
            }
        }

        this._x = x;
        this._y = y;
        this._z = z;
        this._order = order;

        if (update)
        {
            this.onChangeCallback(this);
        }

        return this;
    }

});

Euler.RotationOrders = [ 'XYZ', 'YXZ', 'ZXY', 'ZYX', 'YZX', 'XZY' ];

Euler.DefaultOrder = 'XYZ';

module.exports = Euler;
