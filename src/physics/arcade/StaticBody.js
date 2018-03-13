/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CircleContains = require('../../geom/circle/Contains');
var Class = require('../../utils/Class');
var CONST = require('./const');
var RectangleContains = require('../../geom/rectangle/Contains');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * [description]
 *
 * @class StaticBody
 * @memberOf Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.World} world - [description]
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 */
var StaticBody = new Class({

    initialize:

    function StaticBody (world, gameObject)
    {
        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#world
         * @type {Phaser.Physics.Arcade.World}
         * @since 3.0.0
         */
        this.world = world;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#gameObject
         * @type {Phaser.GameObjects.GameObject}
         * @since 3.0.0
         */
        this.gameObject = gameObject;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#debugShowBody
         * @type {boolean}
         * @since 3.0.0
         */
        this.debugShowBody = world.defaults.debugShowStaticBody;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#debugBodyColor
         * @type {integer}
         * @since 3.0.0
         */
        this.debugBodyColor = world.defaults.staticBodyDebugColor;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#enable
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.enable = true;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#isCircle
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.isCircle = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#radius
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.radius = 0;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#offset
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.offset = new Vector2();

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#position
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.position = new Vector2(gameObject.x - gameObject.displayOriginX, gameObject.y - gameObject.displayOriginY);

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#width
         * @type {number}
         * @since 3.0.0
         */
        this.width = gameObject.displayWidth;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#height
         * @type {number}
         * @since 3.0.0
         */
        this.height = gameObject.displayHeight;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#halfWidth
         * @type {number}
         * @since 3.0.0
         */
        this.halfWidth = Math.abs(this.width / 2);

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#halfHeight
         * @type {number}
         * @since 3.0.0
         */
        this.halfHeight = Math.abs(this.height / 2);

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#center
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.center = new Vector2(gameObject.x + this.halfWidth, gameObject.y + this.halfHeight);

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#velocity
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.velocity = Vector2.ZERO;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#allowGravity
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.allowGravity = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#gravity
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.gravity = Vector2.ZERO;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#bounce
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.bounce = Vector2.ZERO;

        //  If true this Body will dispatch events

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#onWorldBounds
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.onWorldBounds = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#onCollide
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.onCollide = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#onOverlap
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.onOverlap = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#mass
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.mass = 1;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#immovable
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.immovable = true;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#customSeparateX
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.customSeparateX = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#customSeparateY
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.customSeparateY = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#overlapX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.overlapX = 0;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#overlapY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.overlapY = 0;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#overlapR
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.overlapR = 0;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#embedded
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.embedded = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#collideWorldBounds
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.collideWorldBounds = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#checkCollision
         * @type {object}
         * @since 3.0.0
         */
        this.checkCollision = { none: false, up: true, down: true, left: true, right: true };

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#touching
         * @type {object}
         * @since 3.0.0
         */
        this.touching = { none: true, up: false, down: false, left: false, right: false };

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#wasTouching
         * @type {object}
         * @since 3.0.0
         */
        this.wasTouching = { none: true, up: false, down: false, left: false, right: false };

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#blocked
         * @type {object}
         * @since 3.0.0
         */
        this.blocked = { none: true, up: false, down: false, left: false, right: false };

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticBody#physicsType
         * @type {integer}
         * @since 3.0.0
         */
        this.physicsType = CONST.STATIC_BODY;
    },

    /**
     * Changes the Game Object this Body is bound to.
     * First it removes its reference from the old Game Object, then sets the new one.
     * You can optionally update the position and dimensions of this Body to reflect that of the new Game Object.
     *
     * @method Phaser.Physics.Arcade.StaticBody#setGameObject
     * @since 3.1.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The new Game Object that will own this Body.
     * @param {boolean} [update=true] - Reposition and resize this Body to match the new Game Object?
     *
     * @return {Phaser.Physics.Arcade.StaticBody} This Static Body object.
     */
    setGameObject: function (gameObject, update)
    {
        if (gameObject && gameObject !== this.gameObject)
        {
            //  Remove this body from the old game object
            this.gameObject.body = null;

            gameObject.body = this;

            //  Update our reference
            this.gameObject = gameObject;
        }

        if (update)
        {
            this.updateFromGameObject();
        }

        return this;
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
        this.world.staticTree.remove(this);

        var gameObject = this.gameObject;

        gameObject.getTopLeft(this.position);

        this.width = gameObject.displayWidth;
        this.height = gameObject.displayHeight;

        this.halfWidth = Math.abs(this.width / 2);
        this.halfHeight = Math.abs(this.height / 2);

        this.center.set(this.position.x + this.halfWidth, this.position.y + this.halfHeight);

        this.world.staticTree.insert(this);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticBody#setSize
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {number} [offsetX] - [description]
     * @param {number} [offsetY] - [description]
     *
     * @return {Phaser.Physics.Arcade.StaticBody} This Static Body object.
     */
    setSize: function (width, height, offsetX, offsetY)
    {
        if (offsetX === undefined) { offsetX = this.offset.x; }
        if (offsetY === undefined) { offsetY = this.offset.y; }

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
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticBody#setCircle
     * @since 3.0.0
     *
     * @param {number} radius - [description]
     * @param {number} [offsetX] - [description]
     * @param {number} [offsetY] - [description]
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticBody#updateCenter
     * @since 3.0.0
     */
    updateCenter: function ()
    {
        this.center.set(this.position.x + this.halfWidth, this.position.y + this.halfHeight);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticBody#reset
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     */
    reset: function (x, y)
    {
        var gameObject = this.gameObject;

        if (x === undefined) { x = gameObject.x; }
        if (y === undefined) { y = gameObject.y; }

        this.world.staticTree.remove(this);

        gameObject.getTopLeft(this.position);

        this.updateCenter();

        this.world.staticTree.insert(this);
    },

    /**
     * [description]
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticBody#getBounds
     * @since 3.0.0
     *
     * @param {object} obj - [description]
     *
     * @return {object} [description]
     */
    getBounds: function (obj)
    {
        obj.x = this.x;
        obj.y = this.y;
        obj.right = this.right;
        obj.bottom = this.bottom;

        return obj;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticBody#hitTest
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {boolean} [description]
     */
    hitTest: function (x, y)
    {
        return (this.isCircle) ? CircleContains(this, x, y) : RectangleContains(this, x, y);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticBody#deltaAbsX
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    deltaAbsX: function ()
    {
        return 0;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticBody#deltaAbsY
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    deltaAbsY: function ()
    {
        return 0;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticBody#deltaX
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    deltaX: function ()
    {
        return 0;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticBody#deltaY
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    deltaY: function ()
    {
        return 0;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticBody#deltaZ
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    deltaZ: function ()
    {
        return 0;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticBody#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.enable = false;

        this.world.pendingDestroy.set(this);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticBody#drawDebug
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Graphics} graphic - [description]
     */
    drawDebug: function (graphic)
    {
        var pos = this.position;

        if (this.debugShowBody)
        {
            graphic.lineStyle(1, this.debugBodyColor, 1);
            graphic.strokeRect(pos.x, pos.y, this.width, this.height);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticBody#willDrawDebug
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    willDrawDebug: function ()
    {
        return this.debugShowBody;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticBody#setMass
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Physics.Arcade.StaticBody} This Static Body object.
     */
    setMass: function (value)
    {
        if (value <= 0)
        {
            //  Causes havoc otherwise
            value = 0.1;
        }

        this.mass = value;

        return this;
    },

    /**
     * [description]
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
     * [description]
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
     * [description]
     *
     * @name Phaser.Physics.Arcade.StaticBody#left
     * @type {number}
     * @readOnly
     * @since 3.0.0
     */
    left: {

        get: function ()
        {
            return this.position.x;
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Physics.Arcade.StaticBody#right
     * @type {number}
     * @readOnly
     * @since 3.0.0
     */
    right: {

        get: function ()
        {
            return this.position.x + this.width;
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Physics.Arcade.StaticBody#top
     * @type {number}
     * @readOnly
     * @since 3.0.0
     */
    top: {

        get: function ()
        {
            return this.position.y;
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Physics.Arcade.StaticBody#bottom
     * @type {number}
     * @readOnly
     * @since 3.0.0
     */
    bottom: {

        get: function ()
        {
            return this.position.y + this.height;
        }

    }

});

module.exports = StaticBody;
