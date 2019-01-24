/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CircleContains = require('../../geom/circle/Contains');
var Class = require('../../utils/Class');
var CONST = require('./const');
var RectangleContains = require('../../geom/rectangle/Contains');
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
 * @memberof Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.World} world - The Arcade Physics simulation this Static Body belongs to.
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object this Static Body belongs to.
 */
var StaticBody = new Class({

    initialize:

    function StaticBody (world, gameObject)
    {
        var width = (gameObject.width) ? gameObject.width : 64;
        var height = (gameObject.height) ? gameObject.height : 64;

        /**
         * The Arcade Physics simulation this Static Body belongs to.
         *
         * @name Phaser.Physics.Arcade.StaticBody#world
         * @type {Phaser.Physics.Arcade.World}
         * @since 3.0.0
         */
        this.world = world;

        /**
         * The Game Object this Static Body belongs to.
         *
         * @name Phaser.Physics.Arcade.StaticBody#gameObject
         * @type {Phaser.GameObjects.GameObject}
         * @since 3.0.0
         */
        this.gameObject = gameObject;

        /**
         * Whether the Static Body's boundary is drawn to the debug display.
         *
         * @name Phaser.Physics.Arcade.StaticBody#debugShowBody
         * @type {boolean}
         * @since 3.0.0
         */
        this.debugShowBody = world.defaults.debugShowStaticBody;

        /**
         * The color of this Static Body on the debug display.
         *
         * @name Phaser.Physics.Arcade.StaticBody#debugBodyColor
         * @type {integer}
         * @since 3.0.0
         */
        this.debugBodyColor = world.defaults.staticBodyDebugColor;

        /**
         * Whether this Static Body is updated by the physics simulation.
         *
         * @name Phaser.Physics.Arcade.StaticBody#enable
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.enable = true;

        /**
         * Whether this Static Body's boundary is circular (`true`) or rectangular (`false`).
         *
         * @name Phaser.Physics.Arcade.StaticBody#isCircle
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.isCircle = false;

        /**
         * If this Static Body is circular, this is the unscaled radius of the Static Body's boundary, as set by {@link #setCircle}, in source pixels.
         * The true radius is equal to `halfWidth`.
         *
         * @name Phaser.Physics.Arcade.StaticBody#radius
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.radius = 0;

        /**
         * The offset of this Static Body's actual position from any updated position.
         *
         * Unlike a dynamic Body, a Static Body does not follow its Game Object. As such, this offset is only applied when resizing the Static Body.
         *
         * @name Phaser.Physics.Arcade.StaticBody#offset
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.offset = new Vector2();

        /**
         * The position of this Static Body within the simulation.
         *
         * @name Phaser.Physics.Arcade.StaticBody#position
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.position = new Vector2(gameObject.x - gameObject.displayOriginX, gameObject.y - gameObject.displayOriginY);

        /**
         * The width of the Static Body's boundary, in pixels.
         * If the Static Body is circular, this is also the Static Body's diameter.
         *
         * @name Phaser.Physics.Arcade.StaticBody#width
         * @type {number}
         * @since 3.0.0
         */
        this.width = width;

        /**
         * The height of the Static Body's boundary, in pixels.
         * If the Static Body is circular, this is also the Static Body's diameter.
         *
         * @name Phaser.Physics.Arcade.StaticBody#height
         * @type {number}
         * @since 3.0.0
         */
        this.height = height;

        /**
         * Half the Static Body's width, in pixels.
         * If the Static Body is circular, this is also the Static Body's radius.
         *
         * @name Phaser.Physics.Arcade.StaticBody#halfWidth
         * @type {number}
         * @since 3.0.0
         */
        this.halfWidth = Math.abs(this.width / 2);

        /**
         * Half the Static Body's height, in pixels.
         * If the Static Body is circular, this is also the Static Body's radius.
         *
         * @name Phaser.Physics.Arcade.StaticBody#halfHeight
         * @type {number}
         * @since 3.0.0
         */
        this.halfHeight = Math.abs(this.height / 2);

        /**
         * The center of the Static Body's boundary.
         * This is the midpoint of its `position` (top-left corner) and its bottom-right corner.
         *
         * @name Phaser.Physics.Arcade.StaticBody#center
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.center = new Vector2(gameObject.x + this.halfWidth, gameObject.y + this.halfHeight);

        /**
         * A constant zero velocity used by the Arcade Physics simulation for calculations.
         *
         * @name Phaser.Physics.Arcade.StaticBody#velocity
         * @type {Phaser.Math.Vector2}
         * @readonly
         * @since 3.0.0
         */
        this.velocity = Vector2.ZERO;

        /**
         * A constant `false` value expected by the Arcade Physics simulation.
         *
         * @name Phaser.Physics.Arcade.StaticBody#allowGravity
         * @type {boolean}
         * @readonly
         * @default false
         * @since 3.0.0
         */
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

        //  If true this Body will dispatch events

        /**
         * Whether the simulation emits a `worldbounds` event when this StaticBody collides with the world boundary.
         * Always false for a Static Body. (Static Bodies never collide with the world boundary and never trigger a `worldbounds` event.)
         *
         * @name Phaser.Physics.Arcade.StaticBody#onWorldBounds
         * @type {boolean}
         * @readonly
         * @default false
         * @since 3.0.0
         */
        this.onWorldBounds = false;

        /**
         * Whether the simulation emits a `collide` event when this StaticBody collides with another.
         *
         * @name Phaser.Physics.Arcade.StaticBody#onCollide
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.onCollide = false;

        /**
         * Whether the simulation emits an `overlap` event when this StaticBody overlaps with another.
         *
         * @name Phaser.Physics.Arcade.StaticBody#onOverlap
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.onOverlap = false;

        /**
         * The StaticBody's inertia, relative to a default unit (1). With `bounce`, this affects the exchange of momentum (velocities) during collisions.
         *
         * @name Phaser.Physics.Arcade.StaticBody#mass
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.mass = 1;

        /**
         * Whether this object can be moved by collisions with another body.
         *
         * @name Phaser.Physics.Arcade.StaticBody#immovable
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.immovable = true;

        /**
         * A flag disabling the default horizontal separation of colliding bodies. Pass your own `collideHandler` to the collider.
         *
         * @name Phaser.Physics.Arcade.StaticBody#customSeparateX
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.customSeparateX = false;

        /**
         * A flag disabling the default vertical separation of colliding bodies. Pass your own `collideHandler` to the collider.
         *
         * @name Phaser.Physics.Arcade.StaticBody#customSeparateY
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.customSeparateY = false;

        /**
         * The amount of horizontal overlap (before separation), if this Body is colliding with another.
         *
         * @name Phaser.Physics.Arcade.StaticBody#overlapX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.overlapX = 0;

        /**
         * The amount of vertical overlap (before separation), if this Body is colliding with another.
         *
         * @name Phaser.Physics.Arcade.StaticBody#overlapY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.overlapY = 0;

        /**
         * The amount of overlap (before separation), if this StaticBody is circular and colliding with another circular body.
         *
         * @name Phaser.Physics.Arcade.StaticBody#overlapR
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.overlapR = 0;

        /**
         * Whether this StaticBody has ever overlapped with another while both were not moving.
         *
         * @name Phaser.Physics.Arcade.StaticBody#embedded
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.embedded = false;

        /**
         * Whether this StaticBody interacts with the world boundary.
         * Always false for a Static Body. (Static Bodies never collide with the world boundary.)
         *
         * @name Phaser.Physics.Arcade.StaticBody#collideWorldBounds
         * @type {boolean}
         * @readonly
         * @default false
         * @since 3.0.0
         */
        this.collideWorldBounds = false;

        /**
         * Whether this StaticBody is checked for collisions and for which directions. You can set `checkCollision.none = false` to disable collision checks.
         *
         * @name Phaser.Physics.Arcade.StaticBody#checkCollision
         * @type {ArcadeBodyCollision}
         * @since 3.0.0
         */
        this.checkCollision = { none: false, up: true, down: true, left: true, right: true };

        /**
         * Whether this StaticBody has ever collided with another body and in which direction.
         *
         * @name Phaser.Physics.Arcade.StaticBody#touching
         * @type {ArcadeBodyCollision}
         * @since 3.0.0
         */
        this.touching = { none: true, up: false, down: false, left: false, right: false };

        /**
         * Whether this StaticBody was colliding with another body during the last step or any previous step, and in which direction.
         *
         * @name Phaser.Physics.Arcade.StaticBody#wasTouching
         * @type {ArcadeBodyCollision}
         * @since 3.0.0
         */
        this.wasTouching = { none: true, up: false, down: false, left: false, right: false };

        /**
         * Whether this StaticBody has ever collided with a tile or the world boundary.
         *
         * @name Phaser.Physics.Arcade.StaticBody#blocked
         * @type {ArcadeBodyCollision}
         * @since 3.0.0
         */
        this.blocked = { none: true, up: false, down: false, left: false, right: false };

        /**
         * The StaticBody's physics type (static by default).
         *
         * @name Phaser.Physics.Arcade.StaticBody#physicsType
         * @type {integer}
         * @default Phaser.Physics.Arcade.STATIC_BODY
         * @since 3.0.0
         */
        this.physicsType = CONST.STATIC_BODY;

        /**
         * The calculated change in the Body's horizontal position during the current step.
         * For a static body this is always zero.
         *
         * @name Phaser.Physics.Arcade.StaticBody#_dx
         * @type {number}
         * @private
         * @default 0
         * @since 3.10.0
         */
        this._dx = 0;

        /**
         * The calculated change in the Body's vertical position during the current step.
         * For a static body this is always zero.
         *
         * @name Phaser.Physics.Arcade.StaticBody#_dy
         * @type {number}
         * @private
         * @default 0
         * @since 3.10.0
         */
        this._dy = 0;
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
     *
     * @see Phaser.Physics.Arcade.StaticBody#updateFromGameObject
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

        if (!width && gameObject.frame)
        {
            width = gameObject.frame.realWidth;
        }

        if (!height && gameObject.frame)
        {
            height = gameObject.frame.realHeight;
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
     * Updates the StaticBody's `center` from its `position` and dimensions.
     *
     * @method Phaser.Physics.Arcade.StaticBody#updateCenter
     * @since 3.0.0
     */
    updateCenter: function ()
    {
        this.center.set(this.position.x + this.halfWidth, this.position.y + this.halfHeight);
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

        if (x === undefined) { x = gameObject.x; }
        if (y === undefined) { y = gameObject.y; }

        this.world.staticTree.remove(this);

        gameObject.setPosition(x, y);
        
        gameObject.getTopLeft(this.position);

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
     * Returns the x and y coordinates of the top left and bottom right points of the StaticBody.
     *
     * @method Phaser.Physics.Arcade.StaticBody#getBounds
     * @since 3.0.0
     *
     * @param {ArcadeBodyBounds} obj - The object which will hold the coordinates of the bounds.
     *
     * @return {ArcadeBodyBounds} The same object that was passed with `x`, `y`, `right` and `bottom` values matching the respective values of the StaticBody.
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
     * Checks to see if a given x,y coordinate is colliding with this Static Body.
     *
     * @method Phaser.Physics.Arcade.StaticBody#hitTest
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate to check against this body.
     * @param {number} y - The y coordinate to check against this body.
     *
     * @return {boolean} `true` if the given coordinate lies within this body, otherwise `false`.
     */
    hitTest: function (x, y)
    {
        return (this.isCircle) ? CircleContains(this, x, y) : RectangleContains(this, x, y);
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
     * Disables this Body and marks it for destruction during the next step.
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
     * Draws a graphical representation of the StaticBody for visual debugging purposes.
     *
     * @method Phaser.Physics.Arcade.StaticBody#drawDebug
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Graphics} graphic - The Graphics object to use for the debug drawing of the StaticBody.
     */
    drawDebug: function (graphic)
    {
        var pos = this.position;

        var x = pos.x + this.halfWidth;
        var y = pos.y + this.halfHeight;

        if (this.debugShowBody)
        {
            graphic.lineStyle(1, this.debugBodyColor, 1);

            if (this.isCircle)
            {
                graphic.strokeCircle(x, y, this.width / 2);
            }
            else
            {
                graphic.strokeRect(pos.x, pos.y, this.width, this.height);
            }

        }
    },

    /**
     * Indicates whether the StaticBody is going to be showing a debug visualization during postUpdate.
     *
     * @method Phaser.Physics.Arcade.StaticBody#willDrawDebug
     * @since 3.0.0
     *
     * @return {boolean} Whether or not the StaticBody is going to show the debug visualization during postUpdate.
     */
    willDrawDebug: function ()
    {
        return this.debugShowBody;
    },

    /**
     * Sets the Mass of the StaticBody. Will set the Mass to 0.1 if the value passed is less than or equal to zero.
     *
     * @method Phaser.Physics.Arcade.StaticBody#setMass
     * @since 3.0.0
     *
     * @param {number} value - The value to set the Mass to. Values of zero or less are changed to 0.1.
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
     * @readonly
     * @since 3.0.0
     */
    left: {

        get: function ()
        {
            return this.position.x;
        }

    },

    /**
     * The right-most x coordinate of the area of the StaticBody.
     *
     * @name Phaser.Physics.Arcade.StaticBody#right
     * @type {number}
     * @readonly
     * @since 3.0.0
     */
    right: {

        get: function ()
        {
            return this.position.x + this.width;
        }

    },

    /**
     * The highest y coordinate of the area of the StaticBody.
     *
     * @name Phaser.Physics.Arcade.StaticBody#top
     * @type {number}
     * @readonly
     * @since 3.0.0
     */
    top: {

        get: function ()
        {
            return this.position.y;
        }

    },

    /**
     * The lowest y coordinate of the area of the StaticBody. (y + height)
     *
     * @name Phaser.Physics.Arcade.StaticBody#bottom
     * @type {number}
     * @readonly
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
