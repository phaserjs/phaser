/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var MATH_CONST = require('../../math/const');
var WrapAngle = require('../../math/angle/Wrap');
var WrapAngleDegrees = require('../../math/angle/WrapDegrees');

//  global bitmask flag for GameObject.renderMask (used by Scale)
var _FLAG = 4; // 0100

/**
 * Provides methods used for getting and setting the position, scale and rotation of a Game Object.
 *
 * @name Phaser.GameObjects.Components.Transform
 * @since 3.0.0
 */

var Transform = {

    //  "private" properties
    _scaleX: 1,
    _scaleY: 1,
    _rotation: 0,

    /**
     * The x position of this Game Object.
     *
     * @name Phaser.GameObjects.Components.Transform#x
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    x: 0,

    /**
     * The y position of this Game Object.
     *
     * @name Phaser.GameObjects.Components.Transform#y
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    y: 0,

    /**
     * The z position of this Game Object.
     * Note: Do not use this value to set the z-index, instead see the `depth` property.
     *
     * @name Phaser.GameObjects.Components.Transform#z
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    z: 0,

    /**
     * The w position of this Game Object.
     *
     * @name Phaser.GameObjects.Components.Transform#w
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    w: 0,

    /**
     * The horizontal scale of this Game Object.
     *
     * @name Phaser.GameObjects.Components.Transform#scaleX
     * @type {number}
     * @default 1
     * @since 3.0.0
     */
    scaleX: {

        get: function ()
        {
            return this._scaleX;
        },

        set: function (value)
        {
            this._scaleX = value;

            if (this._scaleX === 0)
            {
                this.renderFlags &= ~_FLAG;
            }
            else
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    /**
     * The vertical scale of this Game Object.
     *
     * @name Phaser.GameObjects.Components.Transform#scaleY
     * @type {number}
     * @default 1
     * @since 3.0.0
     */
    scaleY: {

        get: function ()
        {
            return this._scaleY;
        },

        set: function (value)
        {
            this._scaleY = value;

            if (this._scaleY === 0)
            {
                this.renderFlags &= ~_FLAG;
            }
            else
            {
                this.renderFlags |= _FLAG;
            }
        }

    },

    /**
     * The angle of this Game Object as expressed in degrees.
     *
     * Where 0 is to the right, 90 is down, 180 is left.
     *
     * If you prefer to work in radians, see the `rotation` property instead.
     *
     * @name Phaser.GameObjects.Components.Transform#angle
     * @type {integer}
     * @default 0
     * @since 3.0.0
     */
    angle: {

        get: function ()
        {
            return WrapAngleDegrees(this._rotation * MATH_CONST.RAD_TO_DEG);
        },

        set: function (value)
        {
            //  value is in degrees
            this.rotation = WrapAngleDegrees(value) * MATH_CONST.DEG_TO_RAD;
        }
    },

    /**
     * The angle of this Game Object in radians.
     *
     * If you prefer to work in degrees, see the `angle` property instead.
     *
     * @name Phaser.GameObjects.Components.Transform#rotation
     * @type {number}
     * @default 1
     * @since 3.0.0
     */
    rotation: {

        get: function ()
        {
            return this._rotation;
        },

        set: function (value)
        {
            //  value is in radians
            this._rotation = WrapAngle(value);
        }
    },

    /**
     * Sets the position of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setPosition
     * @since 3.0.0
     *
     * @param {number} [x=0] - The x position of this Game Object.
     * @param {number} [y] - The y position of this Game Object. If not set it will use the `x` value.
     * @param {number} [z=0] - The z position of this Game Object.
     * @param {number} [w=0] - The w position of this Game Object.
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    setPosition: function (x, y, z, w)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }
        if (z === undefined) { z = 0; }
        if (w === undefined) { w = 0; }

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;
    },

    /**
     * Sets the rotation of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setRotation
     * @since 3.0.0
     *
     * @param {number} [radians=0] - The rotation of this Game Object, in radians.
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    setRotation: function (radians)
    {
        if (radians === undefined) { radians = 0; }

        this.rotation = radians;

        return this;
    },

    /**
     * Sets the angle of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setAngle
     * @since 3.0.0
     *
     * @param {number} [degrees=0] - The rotation of this Game Object, in degrees.
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    setAngle: function (degrees)
    {
        if (degrees === undefined) { degrees = 0; }

        this.angle = degrees;

        return this;
    },

    /**
     * Sets the scale of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setScale
     * @since 3.0.0
     *
     * @param {number} x - The horizontal scale of this Game Object.
     * @param {number} [y=x] - The vertical scale of this Game Object. If not set it will use the `x` value.
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    setScale: function (x, y)
    {
        if (x === undefined) { x = 1; }
        if (y === undefined) { y = x; }

        this.scaleX = x;
        this.scaleY = y;

        return this;
    },

    /**
     * Sets the x position of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setX
     * @since 3.0.0
     *
     * @param {number} [value=0] - The x position of this Game Object.
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    setX: function (value)
    {
        if (value === undefined) { value = 0; }

        this.x = value;

        return this;
    },

    /**
     * Sets the y position of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setY
     * @since 3.0.0
     *
     * @param {number} [value=0] - The y position of this Game Object.
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    setY: function (value)
    {
        if (value === undefined) { value = 0; }

        this.y = value;

        return this;
    },

    /**
     * Sets the z position of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setZ
     * @since 3.0.0
     *
     * @param {number} [value=0] - The z position of this Game Object.
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    setZ: function (value)
    {
        if (value === undefined) { value = 0; }

        this.z = value;

        return this;
    },

    /**
     * Sets the w position of this Game Object.
     *
     * @method Phaser.GameObjects.Components.Transform#setW
     * @since 3.0.0
     *
     * @param {number} [value=0] - The w position of this Game Object.
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    setW: function (value)
    {
        if (value === undefined) { value = 0; }

        this.w = value;

        return this;
    }

};

module.exports = Transform;
