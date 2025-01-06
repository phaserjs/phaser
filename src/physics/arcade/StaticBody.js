/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CircleContains = require('../../geom/circle/Contains');
var Class = require('../../utils/Class');
var CollisionComponent = require('./components/Collision');
var CONST = require('./const');
var RectangleContains = require('../../geom/rectangle/Contains');
var SetCollisionObject = require('./SetCollisionObject');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * A Static Arcade Physics Body.
 *
 * A Static Body never moves, and isn't automatically synchronized with its parent Game Object.
 * That means if you make any change to the parent's origin, position, or scale after creating or adding the body, you'll need to update the Static Body manually.
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
 * @extends Phaser.Physics.Arcade.Components.Collision
 *
 * @param {Phaser.Physics.Arcade.World} world - The Arcade Physics simulation this Static Body belongs to.
 * @param {Phaser.GameObjects.GameObject} [gameObject] - The Game Object this Body belongs to. As of Phaser 3.60 this is now optional.
 */
var StaticBody = new Class({

    Mixins: [
        CollisionComponent
    ],

    initialize:

    function StaticBody (world, gameObject)
    {
        var width = 64;
        var height = 64;

        var dummyGameObject = {
            x: 0,
            y: 0,
            angle: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            displayOriginX: 0,
            displayOriginY: 0
        };

        var hasGameObject = (gameObject !== undefined);

        if (hasGameObject && gameObject.displayWidth)
        {
            width = gameObject.displayWidth;
            height = gameObject.displayHeight;
        }

        if (!hasGameObject)
        {
            gameObject = dummyGameObject;
        }

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
         * As of Phaser 3.60 this is now optional and can be undefined.
         *
         * @name Phaser.Physics.Arcade.StaticBody#gameObject
         * @type {Phaser.GameObjects.GameObject}
         * @since 3.0.0
         */
        this.gameObject = (hasGameObject) ? gameObject : undefined;

        /**
         * A quick-test flag that signifies this is a Body, used in the World collision handler.
         *
         * @name Phaser.Physics.Arcade.StaticBody#isBody
         * @type {boolean}
         * @readonly
         * @since 3.60.0
         */
        this.isBody = true;

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
         * @type {number}
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
         * If this Static Body is circular, this is the radius of the boundary, as set by {@link Phaser.Physics.Arcade.StaticBody#setCircle}, in pixels.
         * Equal to `halfWidth`.
         *
         * @name Phaser.Physics.Arcade.StaticBody#radius
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.radius = 0;

        /**
         * The offset set by {@link Phaser.Physics.Arcade.StaticBody#setCircle} or {@link Phaser.Physics.Arcade.StaticBody#setSize}.
         *
         * This doesn't affect the Static Body's position, because a Static Body does not follow its Game Object.
         *
         * @name Phaser.Physics.Arcade.StaticBody#offset
         * @type {Phaser.Math.Vector2}
         * @readonly
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
        this.position = new Vector2(gameObject.x - (width * gameObject.originX), gameObject.y - (height * gameObject.originY));

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
        this.center = new Vector2(this.position.x + this.halfWidth, this.position.y + this.halfHeight);

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
         * Sets if this Body can be pushed by another Body.
         *
         * A body that cannot be pushed will reflect back all of the velocity it is given to the
         * colliding body. If that body is also not pushable, then the separation will be split
         * between them evenly.
         *
         * If you want your body to never move or seperate at all, see the `setImmovable` method.
         *
         * By default, Static Bodies are not pushable.
         *
         * @name Phaser.Physics.Arcade.StaticBody#pushable
         * @type {boolean}
         * @default false
         * @since 3.50.0
         * @see Phaser.GameObjects.Components.Pushable#setPushable
         */
        this.pushable = false;

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
         * @type {Phaser.Types.Physics.Arcade.ArcadeBodyCollision}
         * @since 3.0.0
         */
        this.checkCollision = SetCollisionObject(false);

        /**
         * This property is kept for compatibility with Dynamic Bodies.
         * Avoid using it.
         *
         * @name Phaser.Physics.Arcade.StaticBody#touching
         * @type {Phaser.Types.Physics.Arcade.ArcadeBodyCollision}
         * @since 3.0.0
         */
        this.touching = SetCollisionObject(true);

        /**
         * This property is kept for compatibility with Dynamic Bodies.
         * Avoid using it.
         * The values are always false for a Static Body.
         *
         * @name Phaser.Physics.Arcade.StaticBody#wasTouching
         * @type {Phaser.Types.Physics.Arcade.ArcadeBodyCollision}
         * @since 3.0.0
         */
        this.wasTouching = SetCollisionObject(true);

        /**
         * This property is kept for compatibility with Dynamic Bodies.
         * Avoid using it.
         *
         * @name Phaser.Physics.Arcade.StaticBody#blocked
         * @type {Phaser.Types.Physics.Arcade.ArcadeBodyCollision}
         * @since 3.0.0
         */
        this.blocked = SetCollisionObject(true);

        /**
         * The StaticBody's physics type (static by default).
         *
         * @name Phaser.Physics.Arcade.StaticBody#physicsType
         * @type {number}
         * @default Phaser.Physics.Arcade.STATIC_BODY
         * @since 3.0.0
         */
        this.physicsType = CONST.STATIC_BODY;

        /**
         * The Arcade Physics Body Collision Category.
         *
         * This can be set to any valid collision bitfield value.
         *
         * See the `setCollisionCategory` method for more details.
         *
         * @name Phaser.Physics.Arcade.StaticBody#collisionCategory
         * @type {number}
         * @since 3.70.0
         */
        this.collisionCategory = 0x0001;

        /**
         * The Arcade Physics Body Collision Mask.
         *
         * See the `setCollidesWith` method for more details.
         *
         * @name Phaser.Physics.Arcade.StaticBody#collisionMask
         * @type {number}
         * @since 3.70.0
         */
        this.collisionMask = 1;

        /**
         * The calculated change in the Static Body's horizontal position during the current step.
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
         * The calculated change in the Static Body's vertical position during the current step.
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
     * 
     * First it removes its reference from the old Game Object, then sets the new one.
     * 
     * This body will be resized to match the frame dimensions of the given Game Object, if it has a texture frame.
     * You can optionally update the position and dimensions of this Body to reflect that of the new Game Object.
     *
     * @method Phaser.Physics.Arcade.StaticBody#setGameObject
     * @since 3.1.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to assign this Body to.
     * @param {boolean} [update=true] - Reposition and resize this Body to match the new Game Object?
     * @param {boolean} [enable=true] - Automatically enable this Body for physics.
     *
     * @return {Phaser.Physics.Arcade.StaticBody} This Static Body object.
     *
     * @see Phaser.Physics.Arcade.StaticBody#updateFromGameObject
     */
    setGameObject: function (gameObject, update, enable)
    {
        if (update === undefined) { update = true; }
        if (enable === undefined) { enable = true; }

        if (!gameObject || !gameObject.hasTransformComponent)
        {
            //  We need a valid Game Object to continue
            return this;
        }

        var world = this.world;

        if (this.gameObject && this.gameObject.body)
        {
            world.disable(this.gameObject);

            //  Disconnect the current Game Object
            this.gameObject.body = null;
        }

        if (gameObject.body)
        {
            //  Remove the body from the world, but don't disable the Game Object
            world.disable(gameObject);
        }

        this.gameObject = gameObject;

        gameObject.body = this;

        //  This will remove the body from the tree, if it's in there and add the new one in
        this.setSize();

        if (update)
        {
            this.updateFromGameObject();
        }

        this.enable = enable;

        return this;
    },

    /**
     * Syncs the Static Body's position and size with its parent Game Object.
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
     * Positions the Static Body at an offset from its Game Object.
     *
     * @method Phaser.Physics.Arcade.StaticBody#setOffset
     * @since 3.4.0
     *
     * @param {number} x - The horizontal offset of the Static Body from the Game Object's `x`.
     * @param {number} y - The vertical offset of the Static Body from the Game Object's `y`.
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
     * Sets the size of the Static Body.
     * When `center` is true, also repositions it.
     * Resets the width and height to match current frame, if no width and height provided and a frame is found.
     *
     * @method Phaser.Physics.Arcade.StaticBody#setSize
     * @since 3.0.0
     *
     * @param {number} [width] - The width of the Static Body in pixels. Cannot be zero. If not given, and the parent Game Object has a frame, it will use the frame width.
     * @param {number} [height] - The height of the Static Body in pixels. Cannot be zero. If not given, and the parent Game Object has a frame, it will use the frame height.
     * @param {boolean} [center=true] - Place the Static Body's center on its Game Object's center. Only works if the Game Object has the `getCenter` method.
     *
     * @return {Phaser.Physics.Arcade.StaticBody} This Static Body object.
     */
    setSize: function (width, height, center)
    {
        if (center === undefined) { center = true; }

        var gameObject = this.gameObject;

        if (gameObject && gameObject.frame)
        {
            if (!width)
            {
                width = gameObject.frame.realWidth;
            }

            if (!height)
            {
                height = gameObject.frame.realHeight;
            }
        }

        this.world.staticTree.remove(this);

        this.width = width;
        this.height = height;

        this.halfWidth = Math.floor(width / 2);
        this.halfHeight = Math.floor(height / 2);

        if (center && gameObject && gameObject.getCenter)
        {
            var ox = gameObject.displayWidth / 2;
            var oy = gameObject.displayHeight / 2;

            this.position.x -= this.offset.x;
            this.position.y -= this.offset.y;

            this.offset.set(ox - this.halfWidth, oy - this.halfHeight);

            this.position.x += this.offset.x;
            this.position.y += this.offset.y;
        }

        this.updateCenter();

        this.isCircle = false;
        this.radius = 0;

        this.world.staticTree.insert(this);

        return this;
    },

    /**
     * Sets this Static Body to have a circular body and sets its size and position.
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
     * Resets this Static Body to its parent Game Object's position.
     *
     * If `x` and `y` are given, the parent Game Object is placed there and this Static Body is centered on it.
     * Otherwise this Static Body is centered on the Game Object's current position.
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

        this.position.x += this.offset.x;
        this.position.y += this.offset.y;

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
     * @param {Phaser.Types.Physics.Arcade.ArcadeBodyBounds} obj - The object which will hold the coordinates of the bounds.
     *
     * @return {Phaser.Types.Physics.Arcade.ArcadeBodyBounds} The same object that was passed with `x`, `y`, `right` and `bottom` values matching the respective values of the StaticBody.
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
            graphic.lineStyle(graphic.defaultStrokeWidth, this.debugBodyColor, 1);

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
