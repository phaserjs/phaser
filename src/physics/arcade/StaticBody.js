/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BaseBody = require('./BaseBody');
var Class = require('../../utils/Class');
var CONST = require('./const');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * A Static Arcade Physics Body.
 *
 * A Static Body never moves, and isn't automatically synchronized with its parent Game Object.
 * That means if you make any change to the parent's origin, position, or scale after creating or adding the body, you'll need to update the Body manually.
 *
 * A Static Body can collide with other Bodies, but is never moved by collisions.
 *
 * Its dynamic counterpart is {@link Phaser.Physics.Arcade.Body}.
 *
 * @class StaticBody
 * @extends Phaser.Physics.Arcade.BaseBody
 * @memberof Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.World} world - The Arcade Physics simulation this Static Body belongs to.
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object this Static Body belongs to.
 */
var StaticBody = new Class({

    Extends: BaseBody,

    initialize:

    function StaticBody (world, gameObject, x, y, width, height)
    {
        BaseBody.call(this, world, gameObject, CONST.STATIC_BODY, x, y, width, height);

        /**
         * A constant zero velocity used by the Arcade Physics simulation for calculations.
         *
         * @name Phaser.Physics.Arcade.StaticBody#velocity
         * @type {Phaser.Math.Vector2}
         * @readonly
         * @since 3.0.0
         */
        this.velocity = Vector2.ZERO;

        this.allowGravity = false;

        /**
         * Gravitational force applied specifically to this Body. Values are in pixels per second squared. Always zero for a Static Body.
         *
         * @name Phaser.Physics.Arcade.StaticBody#gravity
         * @type {Phaser.Math.Vector2}
         * @readonly
         * @since 3.0.0
         */
        this.gravity = Vector2.ZERO;

        /**
         * Rebound, or restitution, following a collision, relative to 1. Always zero for a Static Body.
         *
         * @name Phaser.Physics.Arcade.StaticBody#bounce
         * @type {Phaser.Math.Vector2}
         * @readonly
         * @since 3.0.0
         */
        this.bounce = Vector2.ZERO;

        this.immovable = true;

        /**
         * Whether this StaticBody has ever overlapped with another while both were not moving.
         *
         * @name Phaser.Physics.Arcade.StaticBody#embedded
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.embedded = false;
    },

    /**
     * Updates this Static Body so that its position and dimensions are updated
     * based on the current Game Object it is bound to.
     *
     * @method Phaser.Physics.Arcade.StaticBody#updateFromGameObject
     * @since 3.1.0
     *
     * @return {Phaser.Physics.Arcade.StaticBody} This Static Body object.
     */
    updateFromGameObject: function ()
    {
        var gameObject = this.gameObject;

        if (gameObject)
        {
            this.world.staticTree.remove(this);

            gameObject.getTopLeft(this.position);

            this.width = gameObject.displayWidth;
            this.height = gameObject.displayHeight;
    
            this.halfWidth = Math.abs(this.width / 2);
            this.halfHeight = Math.abs(this.height / 2);
    
            this.center.set(this.position.x + this.halfWidth, this.position.y + this.halfHeight);
    
            this.world.staticTree.insert(this);
        }

        return this;
    },

    /**
     * Sets the offset of the body.
     *
     * @method Phaser.Physics.Arcade.StaticBody#setOffset
     * @since 3.4.0
     *
     * @param {number} x - The horizontal offset of the Body from the Game Object's center.
     * @param {number} y - The vertical offset of the Body from the Game Object's center.
     *
     * @return {Phaser.Physics.Arcade.StaticBody} This Static Body object.
     */
    setOffset: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.world.staticTree.remove(this);

        this.position.x -= this.offset.x;
        this.position.y -= this.offset.y;

        this.offset.set(x, y);

        this.position.x += this.offset.x;
        this.position.y += this.offset.y;

        this.updateCenter();

        this.world.staticTree.insert(this);

        return this;
    },

    /**
     * Sets the size of the body.
     * Resets the width and height to match current frame, if no width and height provided and a frame is found.
     *
     * @method Phaser.Physics.Arcade.StaticBody#setSize
     * @since 3.0.0
     *
     * @param {integer} [width] - The width of the Body in pixels. Cannot be zero. If not given, and the parent Game Object has a frame, it will use the frame width.
     * @param {integer} [height] - The height of the Body in pixels. Cannot be zero. If not given, and the parent Game Object has a frame, it will use the frame height.
     * @param {number} [offsetX] - The horizontal offset of the Body from the Game Object's center.
     * @param {number} [offsetY] - The vertical offset of the Body from the Game Object's center.
     *
     * @return {Phaser.Physics.Arcade.StaticBody} This Static Body object.
     */
    setSize: function (width, height, offsetX, offsetY)
    {
        if (offsetX === undefined) { offsetX = this.offset.x; }
        if (offsetY === undefined) { offsetY = this.offset.y; }

        var gameObject = this.gameObject;

        if (gameObject)
        {
            if (!width && gameObject.frame)
            {
                width = gameObject.frame.realWidth;
            }
    
            if (!height && gameObject.frame)
            {
                height = gameObject.frame.realHeight;
            }
        }

        this.world.staticTree.remove(this);

        this.width = width;
        this.height = height;

        this.halfWidth = Math.floor(width / 2);
        this.halfHeight = Math.floor(height / 2);

        this.offset.set(offsetX, offsetY);

        this.updateCenter();

        this.isCircle = false;
        this.radius = 0;

        this.world.staticTree.insert(this);

        return this;
    },

    /**
     * Sets this Static Body to have a circular body and sets its sizes and position.
     *
     * @method Phaser.Physics.Arcade.StaticBody#setCircle
     * @since 3.0.0
     *
     * @param {number} radius - The radius of the StaticBody, in pixels.
     * @param {number} [offsetX] - The horizontal offset of the StaticBody from its Game Object, in pixels.
     * @param {number} [offsetY] - The vertical offset of the StaticBody from its Game Object, in pixels.
     *
     * @return {Phaser.Physics.Arcade.StaticBody} This Static Body object.
     */
    setCircle: function (radius, offsetX, offsetY)
    {
        if (offsetX === undefined) { offsetX = this.offset.x; }
        if (offsetY === undefined) { offsetY = this.offset.y; }

        if (radius > 0)
        {
            this.world.staticTree.remove(this);

            this.isCircle = true;

            this.radius = radius;

            this.width = radius * 2;
            this.height = radius * 2;

            this.halfWidth = Math.floor(this.width / 2);
            this.halfHeight = Math.floor(this.height / 2);

            this.offset.set(offsetX, offsetY);

            this.updateCenter();

            this.world.staticTree.insert(this);
        }
        else
        {
            this.isCircle = false;
        }

        return this;
    },

    /**
     * Resets this Body to the given coordinates. Also positions its parent Game Object to the same coordinates.
     * Similar to `updateFromGameObject`, but doesn't modify the Body's dimensions.
     *
     * @method Phaser.Physics.Arcade.StaticBody#reset
     * @since 3.0.0
     *
     * @param {number} [x] - The x coordinate to reset the body to. If not given will use the parent Game Object's coordinate.
     * @param {number} [y] - The y coordinate to reset the body to. If not given will use the parent Game Object's coordinate.
     */
    reset: function (x, y)
    {
        var gameObject = this.gameObject;

        if (x === undefined && gameObject) { x = gameObject.x; }
        if (y === undefined && gameObject) { y = gameObject.y; }

        this.world.staticTree.remove(this);

        if (gameObject)
        {
            gameObject.setPosition(x, y);
        
            gameObject.getTopLeft(this.position);
        }

        this.updateCenter();

        this.world.staticTree.insert(this);
    },

    /**
     * NOOP function. A Static Body cannot be stopped.
     *
     * @method Phaser.Physics.Arcade.StaticBody#stop
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Arcade.StaticBody} This Static Body object.
     */
    stop: function ()
    {
        return this;
    },

    /**
     * NOOP
     *
     * @method Phaser.Physics.Arcade.StaticBody#postUpdate
     * @since 3.12.0
     */
    postUpdate: function ()
    {
    },

    /**
     * NOOP
     *
     * @method Phaser.Physics.Arcade.StaticBody#setBlockedUp
     * @since 3.17.0
     */
    setBlockedUp: function ()
    {
    },

    /**
     * NOOP
     *
     * @method Phaser.Physics.Arcade.StaticBody#setBlockedDown
     * @since 3.17.0
     */
    setBlockedDown: function ()
    {
    },

    /**
     * NOOP
     *
     * @method Phaser.Physics.Arcade.StaticBody#setBlockedLeft
     * @since 3.17.0
     */
    setBlockedLeft: function ()
    {
    },

    /**
     * NOOP
     *
     * @method Phaser.Physics.Arcade.StaticBody#setBlockedRight
     * @since 3.17.0
     */
    setBlockedRight: function ()
    {
    },

    /**
     * The absolute (non-negative) change in this StaticBody's horizontal position from the previous step. Always zero.
     *
     * @method Phaser.Physics.Arcade.StaticBody#deltaAbsX
     * @since 3.0.0
     *
     * @return {number} Always zero for a Static Body.
     */
    deltaAbsX: function ()
    {
        return 0;
    },

    /**
     * The absolute (non-negative) change in this StaticBody's vertical position from the previous step. Always zero.
     *
     * @method Phaser.Physics.Arcade.StaticBody#deltaAbsY
     * @since 3.0.0
     *
     * @return {number} Always zero for a Static Body.
     */
    deltaAbsY: function ()
    {
        return 0;
    },

    /**
     * The change in this StaticBody's horizontal position from the previous step. Always zero.
     *
     * @method Phaser.Physics.Arcade.StaticBody#deltaX
     * @since 3.0.0
     *
     * @return {number} The change in this StaticBody's velocity from the previous step. Always zero.
     */
    deltaX: function ()
    {
        return 0;
    },

    /**
     * The change in this StaticBody's vertical position from the previous step. Always zero.
     *
     * @method Phaser.Physics.Arcade.StaticBody#deltaY
     * @since 3.0.0
     *
     * @return {number} The change in this StaticBody's velocity from the previous step. Always zero.
     */
    deltaY: function ()
    {
        return 0;
    },

    /**
     * The change in this StaticBody's rotation from the previous step. Always zero.
     *
     * @method Phaser.Physics.Arcade.StaticBody#deltaZ
     * @since 3.0.0
     *
     * @return {number} The change in this StaticBody's rotation from the previous step. Always zero.
     */
    deltaZ: function ()
    {
        return 0;
    },

    /**
     * The x coordinate of the StaticBody.
     *
     * @name Phaser.Physics.Arcade.StaticBody#x
     * @type {number}
     * @since 3.0.0
     */
    x: {

        get: function ()
        {
            return this.position.x;
        },

        set: function (value)
        {
            this.world.staticTree.remove(this);

            this.position.x = value;

            this.world.staticTree.insert(this);
        }

    },

    /**
     * The y coordinate of the StaticBody.
     *
     * @name Phaser.Physics.Arcade.StaticBody#y
     * @type {number}
     * @since 3.0.0
     */
    y: {

        get: function ()
        {
            return this.position.y;
        },

        set: function (value)
        {
            this.world.staticTree.remove(this);

            this.position.y = value;

            this.world.staticTree.insert(this);
        }

    },

    /**
     * Returns the left-most x coordinate of the area of the StaticBody.
     *
     * @name Phaser.Physics.Arcade.StaticBody#left
     * @type {number}
     * @since 3.0.0
     */
    left: {

        get: function ()
        {
            return this.position.x;
        },

        set: function (value)
        {
            this.x = value;
        }

    },

    /**
     * The right-most x coordinate of the area of the StaticBody.
     *
     * @name Phaser.Physics.Arcade.StaticBody#right
     * @type {number}
     * @since 3.0.0
     */
    right: {

        get: function ()
        {
            return this.position.x + this.width;
        },

        set: function (value)
        {
            this.world.staticTree.remove(this);

            this.position.x = value - this.width;

            this.world.staticTree.insert(this);
        }

    },

    /**
     * The highest y coordinate of the area of the StaticBody.
     *
     * @name Phaser.Physics.Arcade.StaticBody#top
     * @type {number}
     * @since 3.0.0
     */
    top: {

        get: function ()
        {
            return this.position.y;
        },

        set: function (value)
        {
            this.y = value;
        }

    },

    /**
     * The lowest y coordinate of the area of the StaticBody. (y + height)
     *
     * @name Phaser.Physics.Arcade.StaticBody#bottom
     * @type {number}
     * @since 3.0.0
     */
    bottom: {

        get: function ()
        {
            return this.position.y + this.height;
        },

        set: function (value)
        {
            this.world.staticTree.remove(this);

            this.position.y = value - this.height;

            this.world.staticTree.insert(this);
        }

    }

});

module.exports = StaticBody;
