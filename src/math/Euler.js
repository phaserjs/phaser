/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Clamp = require('./Clamp');
var Class = require('../utils/Class');
var Matrix4 = require('./Matrix4');
var NOOP = require('../utils/NOOP');

var tempMatrix = new Matrix4();

/**
 * @classdesc
 *
 * @class Euler
 * @memberof Phaser.Math
 * @constructor
 * @since 3.50.0
 *
 * @param {number} [x] - The x component.
 * @param {number} [y] - The y component.
 * @param {number} [z] - The z component.
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

    copy: function (euler)
    {
        return this.set(euler.x, euler.y, euler.z, euler.order);
    },

    setFromQuaternion: function (quaternion, order, update)
    {
        if (order === undefined) { order = this._order; }
        if (update === undefined) { update = false; }

        tempMatrix.fromQuat(quaternion);

        return this.setFromRotationMatrix(tempMatrix, order, update);
    },

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
