/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Body = require('../lib/body/Body');
var MATH_CONST = require('../../../math/const');
var WrapAngle = require('../../../math/angle/Wrap');
var WrapAngleDegrees = require('../../../math/angle/WrapDegrees');

//  global bitmask flag for GameObject.renderMask (used by Scale)
var _FLAG = 4; // 0100

//  Transform Component

/**
 * [description]
 *
 * @name Phaser.Physics.Matter.Components.Transform
 * @since 3.0.0
 */
var Transform = {

    /**
     * [description]
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
     * [description]
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
     * [description]
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
            this._scaleX = value;

            if (this._scaleX === 0)
            {
                this.renderFlags &= ~_FLAG;
            }
            else
            {
                this.renderFlags |= _FLAG;
            }

            Body.scale(this.body, value, this._scaleY);
        }

    },

    /**
     * [description]
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
            this._scaleY = value;

            if (this._scaleY === 0)
            {
                this.renderFlags &= ~_FLAG;
            }
            else
            {
                this.renderFlags |= _FLAG;
            }

            Body.scale(this.body, this._scaleX, value);
        }

    },

    /**
     * [description]
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
     * [description]
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
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Transform#setPosition
     * @since 3.0.0
     *
     * @param {number} [x=0] - [description]
     * @param {number} [y=x] - [description]
     *
     * @return{Phaser.GameObjects.GameObject} This Game Object.
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
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Transform#setRotation
     * @since 3.0.0
     *
     * @param {number} [radians=0] - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setRotation: function (radians)
    {
        if (radians === undefined) { radians = 0; }

        this._rotation = WrapAngle(radians);

        Body.setAngle(this.body, radians);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Transform#setFixedRotation
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setFixedRotation: function ()
    {
        Body.setInertia(this.body, Infinity);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Transform#setAngle
     * @since 3.0.0
     *
     * @param {number} [degrees=0] - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setAngle: function (degrees)
    {
        if (degrees === undefined) { degrees = 0; }

        this.angle = degrees;

        Body.setAngle(this.body, this.rotation);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Transform#setScale
     * @since 3.0.0
     *
     * @param {number} [x=1] - [description]
     * @param {number} [y=x] - [description]
     * @param {Phaser.Math.Vector2} [point] - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setScale: function (x, y, point)
    {
        if (x === undefined) { x = 1; }
        if (y === undefined) { y = x; }

        this._scaleX = x;
        this._scaleY = y;

        Body.scale(this.body, x, y, point);

        return this;
    }

};

module.exports = Transform;
