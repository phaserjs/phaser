/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Body = require('../lib/body/Body');
var MATH_CONST = require('../../../math/const');
var WrapAngle = require('../../../math/angle/Wrap');
var WrapAngleDegrees = require('../../../math/angle/WrapDegrees');

//  global bitmask flag for GameObject.renderMask (used by Scale)
var _FLAG = 4; // 0100

//  Transform Component

/**
 * Provides methods used for getting and setting the position, scale and rotation of a Game Object.
 *
 * @namespace Phaser.Physics.Matter.Components.Transform
 * @since 3.0.0
 */
var Transform = {

    /**
     * The x position of this Game Object.
     *
     * @name Phaser.Physics.Matter.Components.Transform#x
     * @type {number}
     * @since 3.0.0
     */
    x: {

        get: function ()
        {
            return this.body.position.x;
        },

        set: function (value)
        {
            this._tempVec2.set(value, this.y);

            Body.setPosition(this.body, this._tempVec2);
        }

    },

    /**
     * The y position of this Game Object.
     *
     * @name Phaser.Physics.Matter.Components.Transform#y
     * @type {number}
     * @since 3.0.0
     */
    y: {

        get: function ()
        {
            return this.body.position.y;
        },

        set: function (value)
        {
            this._tempVec2.set(this.x, value);

            Body.setPosition(this.body, this._tempVec2);
        }

    },

    /**
     * The horizontal scale of this Game Object.
     *
     * @name Phaser.Physics.Matter.Components.Transform#scaleX
     * @type {number}
     * @since 3.0.0
     */
    scaleX: {

        get: function ()
        {
            return this._scaleX;
        },

        set: function (value)
        {
            var factorX = 1 / this._scaleX;
            var factorY = 1 / this._scaleY;

            this._scaleX = value;

            if (this._scaleX === 0)
            {
                this.renderFlags &= ~_FLAG;
            }
            else
            {
                this.renderFlags |= _FLAG;
            }

            //  Reset Matter scale back to 1 (sigh)
            Body.scale(this.body, factorX, factorY);

            Body.scale(this.body, value, this._scaleY);
        }

    },

    /**
     * The vertical scale of this Game Object.
     *
     * @name Phaser.Physics.Matter.Components.Transform#scaleY
     * @type {number}
     * @since 3.0.0
     */
    scaleY: {

        get: function ()
        {
            return this._scaleY;
        },

        set: function (value)
        {
            var factorX = 1 / this._scaleX;
            var factorY = 1 / this._scaleY;

            this._scaleY = value;

            if (this._scaleY === 0)
            {
                this.renderFlags &= ~_FLAG;
            }
            else
            {
                this.renderFlags |= _FLAG;
            }

            Body.scale(this.body, factorX, factorY);

            Body.scale(this.body, this._scaleX, value);
        }

    },

    /**
     * Use `angle` to set or get rotation of the physics body associated to this GameObject.
     * Unlike rotation, when using set the value can be in degrees, which will be converted to radians internally.
     *
     * @name Phaser.Physics.Matter.Components.Transform#angle
     * @type {number}
     * @since 3.0.0
     */
    angle: {

        get: function ()
        {
            return WrapAngleDegrees(this.body.angle * MATH_CONST.RAD_TO_DEG);
        },

        set: function (value)
        {
            //  value is in degrees
            this.rotation = WrapAngleDegrees(value) * MATH_CONST.DEG_TO_RAD;
        }
    },

    /**
     * Use `rotation` to set or get the rotation of the physics body associated with this GameObject.
     * The value when set must be in radians.
     *
     * @name Phaser.Physics.Matter.Components.Transform#rotation
     * @type {number}
     * @since 3.0.0
     */
    rotation: {

        get: function ()
        {
            return this.body.angle;
        },

        set: function (value)
        {
            //  value is in radians
            this._rotation = WrapAngle(value);

            Body.setAngle(this.body, this._rotation);
        }
    },

    /**
     * Sets the position of the physics body along x and y axes.
     * Both the parameters to this function are optional and if not passed any they default to 0.
     * Velocity, angle, force etc. are unchanged.
     *
     * @method Phaser.Physics.Matter.Components.Transform#setPosition
     * @since 3.0.0
     *
     * @param {number} [x=0] - The horizontal position of the body.
     * @param {number} [y=x] - The vertical position of the body.
     *
     * @return {this} This Game Object instance.
     */
    setPosition: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        this._tempVec2.set(x, y);

        Body.setPosition(this.body, this._tempVec2);

        return this;
    },

    /**
     * Immediately sets the angle of the Body.
     * Angular velocity, position, force etc. are unchanged.
     *
     * @method Phaser.Physics.Matter.Components.Transform#setRotation
     * @since 3.0.0
     *
     * @param {number} [radians=0] - The angle of the body, in radians.
     *
     * @return {this} This Game Object instance.
     */
    setRotation: function (radians)
    {
        if (radians === undefined) { radians = 0; }

        this._rotation = WrapAngle(radians);

        Body.setAngle(this.body, radians);

        return this;
    },

    /**
     * Setting fixed rotation sets the Body inertia to Infinity, which stops it
     * from being able to rotate when forces are applied to it.
     *
     * @method Phaser.Physics.Matter.Components.Transform#setFixedRotation
     * @since 3.0.0
     *
     * @return {this} This Game Object instance.
     */
    setFixedRotation: function ()
    {
        Body.setInertia(this.body, Infinity);

        return this;
    },

    /**
     * Immediately sets the angle of the Body.
     * Angular velocity, position, force etc. are unchanged.
     *
     * @method Phaser.Physics.Matter.Components.Transform#setAngle
     * @since 3.0.0
     *
     * @param {number} [degrees=0] - The angle to set, in degrees.
     *
     * @return {this} This Game Object instance.
     */
    setAngle: function (degrees)
    {
        if (degrees === undefined) { degrees = 0; }

        this.angle = degrees;

        Body.setAngle(this.body, this.rotation);

        return this;
    },

    /**
     * Sets the scale of this Game Object.
     *
     * @method Phaser.Physics.Matter.Components.Transform#setScale
     * @since 3.0.0
     *
     * @param {number} [x=1] - The horizontal scale of this Game Object.
     * @param {number} [y=x] - The vertical scale of this Game Object. If not set it will use the x value.
     * @param {Phaser.Math.Vector2} [point] - The point (Vector2) from which scaling will occur.
     *
     * @return {this} This Game Object instance.
     */
    setScale: function (x, y, point)
    {
        if (x === undefined) { x = 1; }
        if (y === undefined) { y = x; }

        var factorX = 1 / this._scaleX;
        var factorY = 1 / this._scaleY;

        this._scaleX = x;
        this._scaleY = y;

        Body.scale(this.body, factorX, factorY, point);

        Body.scale(this.body, x, y, point);

        return this;
    }

};

module.exports = Transform;
