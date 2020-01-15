/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('./const');
var Events = require('./events');
var RadToDeg = require('../../math/RadToDeg');
var Rectangle = require('../../geom/rectangle/Rectangle');
var RectangleContains = require('../../geom/rectangle/Contains');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * A Dynamic Arcade Body.
 *
 * Its static counterpart is {@link Phaser.Physics.Arcade.StaticBody}.
 *
 * @class Body
 * @memberof Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.World} world - The Arcade Physics simulation this Body belongs to.
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object this Body belongs to.
 */
var Body = new Class({

    initialize:

    function Body (world, gameObject)
    {
        var width = (gameObject.width) ? gameObject.width : 64;
        var height = (gameObject.height) ? gameObject.height : 64;

        /**
         * The Arcade Physics simulation this Body belongs to.
         *
         * @name Phaser.Physics.Arcade.Body#world
         * @type {Phaser.Physics.Arcade.World}
         * @since 3.0.0
         */
        this.world = world;

        /**
         * The Game Object this Body belongs to.
         *
         * @name Phaser.Physics.Arcade.Body#gameObject
         * @type {Phaser.GameObjects.GameObject}
         * @since 3.0.0
         */
        this.gameObject = gameObject;

        /**
         * Transformations applied to this Body.
         *
         * @name Phaser.Physics.Arcade.Body#transform
         * @type {object}
         * @since 3.4.0
         */
        this.transform = {
            x: gameObject.x,
            y: gameObject.y,
            rotation: gameObject.angle,
            scaleX: gameObject.scaleX,
            scaleY: gameObject.scaleY,
            displayOriginX: gameObject.displayOriginX,
            displayOriginY: gameObject.displayOriginY
        };

        /**
         * Whether the Body's boundary is drawn to the debug display.
         *
         * @name Phaser.Physics.Arcade.Body#debugShowBody
         * @type {boolean}
         * @since 3.0.0
         */
        this.debugShowBody = world.defaults.debugShowBody;

        /**
         * Whether the Body's velocity is drawn to the debug display.
         *
         * @name Phaser.Physics.Arcade.Body#debugShowVelocity
         * @type {boolean}
         * @since 3.0.0
         */
        this.debugShowVelocity = world.defaults.debugShowVelocity;

        /**
         * The color of this Body on the debug display.
         *
         * @name Phaser.Physics.Arcade.Body#debugBodyColor
         * @type {integer}
         * @since 3.0.0
         */
        this.debugBodyColor = world.defaults.bodyDebugColor;

        /**
         * Whether this Body is updated by the physics simulation.
         *
         * @name Phaser.Physics.Arcade.Body#enable
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.enable = true;

        /**
         * Whether this Body's boundary is circular (true) or rectangular (false).
         *
         * @name Phaser.Physics.Arcade.Body#isCircle
         * @type {boolean}
         * @default false
         * @since 3.0.0
         * @see Phaser.Physics.Arcade.Body#setCircle
         */
        this.isCircle = false;

        /**
         * If this Body is circular, this is the unscaled radius of the Body's boundary, as set by setCircle(), in source pixels.
         * The true radius is equal to `halfWidth`.
         *
         * @name Phaser.Physics.Arcade.Body#radius
         * @type {number}
         * @default 0
         * @since 3.0.0
         * @see Phaser.Physics.Arcade.Body#setCircle
         */
        this.radius = 0;

        /**
         * The offset of this Body's position from its Game Object's position, in source pixels.
         *
         * @name Phaser.Physics.Arcade.Body#offset
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         * @see Phaser.Physics.Arcade.Body#setOffset
         */
        this.offset = new Vector2();

        /**
         * The position of this Body within the simulation.
         *
         * @name Phaser.Physics.Arcade.Body#position
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.position = new Vector2(gameObject.x, gameObject.y);

        /**
         * The position of this Body during the previous step.
         *
         * @name Phaser.Physics.Arcade.Body#prev
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.prev = new Vector2(gameObject.x, gameObject.y);

        /**
         * The position of this Body during the previous frame.
         * 
         * @name Phaser.Physics.Arcade.Body#prevFrame
         * @type {Phaser.Math.Vector2}
         * @since 3.20.0
         */
        this.prevFrame = new Vector2(gameObject.x, gameObject.y);

        /**
         * Whether this Body's `rotation` is affected by its angular acceleration and angular velocity.
         *
         * @name Phaser.Physics.Arcade.Body#allowRotation
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.allowRotation = true;

        /**
         * This body's rotation, in degrees, based on its angular acceleration and angular velocity.
         * The Body's rotation controls the `angle` of its Game Object.
         * It doesn't rotate the Body's boundary, which is always an axis-aligned rectangle or a circle.
         *
         * @name Phaser.Physics.Arcade.Body#rotation
         * @type {number}
         * @since 3.0.0
         */
        this.rotation = gameObject.angle;

        /**
         * The Body rotation, in degrees, during the previous step.
         *
         * @name Phaser.Physics.Arcade.Body#preRotation
         * @type {number}
         * @since 3.0.0
         */
        this.preRotation = gameObject.angle;

        /**
         * The width of the Body boundary, in pixels.
         * If the Body is circular, this is also the diameter.
         * If you wish to change the width use the `Body.setSize` method.
         *
         * @name Phaser.Physics.Arcade.Body#width
         * @type {number}
         * @readonly
         * @default 64
         * @since 3.0.0
         */
        this.width = width;

        /**
         * The height of the Body boundary, in pixels.
         * If the Body is circular, this is also the diameter.
         * If you wish to change the height use the `Body.setSize` method.
         *
         * @name Phaser.Physics.Arcade.Body#height
         * @type {number}
         * @readonly
         * @default 64
         * @since 3.0.0
         */
        this.height = height;

        /**
         * The unscaled width of the Body, in source pixels, as set by setSize().
         * The default is the width of the Body's Game Object's texture frame.
         *
         * @name Phaser.Physics.Arcade.Body#sourceWidth
         * @type {number}
         * @since 3.0.0
         * @see Phaser.Physics.Arcade.Body#setSize
         */
        this.sourceWidth = width;

        /**
         * The unscaled height of the Body, in source pixels, as set by setSize().
         * The default is the height of the Body's Game Object's texture frame.
         *
         * @name Phaser.Physics.Arcade.Body#sourceHeight
         * @type {number}
         * @since 3.0.0
         * @see Phaser.Physics.Arcade.Body#setSize
         */
        this.sourceHeight = height;

        if (gameObject.frame)
        {
            this.sourceWidth = gameObject.frame.realWidth;
            this.sourceHeight = gameObject.frame.realHeight;
        }

        /**
         * Half the Body's width, in pixels.
         *
         * @name Phaser.Physics.Arcade.Body#halfWidth
         * @type {number}
         * @since 3.0.0
         */
        this.halfWidth = Math.abs(width / 2);

        /**
         * Half the Body's height, in pixels.
         *
         * @name Phaser.Physics.Arcade.Body#halfHeight
         * @type {number}
         * @since 3.0.0
         */
        this.halfHeight = Math.abs(height / 2);

        /**
         * The center of the Body's boundary.
         * The midpoint of its `position` (top-left corner) and its bottom-right corner.
         *
         * @name Phaser.Physics.Arcade.Body#center
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.center = new Vector2(gameObject.x + this.halfWidth, gameObject.y + this.halfHeight);

        /**
         * The Body's velocity, in pixels per second.
         *
         * @name Phaser.Physics.Arcade.Body#velocity
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.velocity = new Vector2();

        /**
         * The Body's change in position (due to velocity) at the last step, in pixels.
         *
         * The size of this value depends on the simulation's step rate.
         *
         * @name Phaser.Physics.Arcade.Body#newVelocity
         * @type {Phaser.Math.Vector2}
         * @readonly
         * @since 3.0.0
         */
        this.newVelocity = new Vector2();

        /**
         * The Body's absolute maximum change in position, in pixels per step.
         *
         * @name Phaser.Physics.Arcade.Body#deltaMax
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.deltaMax = new Vector2();

        /**
         * The Body's change in velocity, in pixels per second squared.
         *
         * @name Phaser.Physics.Arcade.Body#acceleration
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.acceleration = new Vector2();

        /**
         * Whether this Body's velocity is affected by its `drag`.
         *
         * @name Phaser.Physics.Arcade.Body#allowDrag
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.allowDrag = true;

        /**
         * Absolute loss of velocity due to movement, in pixels per second squared.
         * The x and y components are applied separately.
         *
         * When `useDamping` is true, this is 1 minus the damping factor.
         * A value of 1 means the Body loses no velocity.
         * A value of 0.95 means the Body loses 5% of its velocity per step.
         * A value of 0.5 means the Body loses 50% of its velocity per step.
         *
         * Drag is applied only when `acceleration` is zero.
         *
         * @name Phaser.Physics.Arcade.Body#drag
         * @type {(Phaser.Math.Vector2|number)}
         * @since 3.0.0
         */
        this.drag = new Vector2();

        /**
         * Whether this Body's position is affected by gravity (local or world).
         *
         * @name Phaser.Physics.Arcade.Body#allowGravity
         * @type {boolean}
         * @default true
         * @since 3.0.0
         * @see Phaser.Physics.Arcade.Body#gravity
         * @see Phaser.Physics.Arcade.World#gravity
         */
        this.allowGravity = true;

        /**
         * Acceleration due to gravity (specific to this Body), in pixels per second squared.
         * Total gravity is the sum of this vector and the simulation's `gravity`.
         *
         * @name Phaser.Physics.Arcade.Body#gravity
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         * @see Phaser.Physics.Arcade.World#gravity
         */
        this.gravity = new Vector2();

        /**
         * Rebound following a collision, relative to 1.
         *
         * @name Phaser.Physics.Arcade.Body#bounce
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.bounce = new Vector2();

        /**
         * Rebound following a collision with the world boundary, relative to 1.
         * If null, `bounce` is used instead.
         *
         * @name Phaser.Physics.Arcade.Body#worldBounce
         * @type {?Phaser.Math.Vector2}
         * @default null
         * @since 3.0.0
         */
        this.worldBounce = null;

        /**
         * The rectangle used for world boundary collisions.
         * 
         * By default it is set to the world boundary rectangle. Or, if this Body was
         * created by a Physics Group, then whatever rectangle that Group defined.
         * 
         * You can also change it by using the `Body.setBoundsRectangle` method.
         *
         * @name Phaser.Physics.Arcade.Body#customBoundsRectangle
         * @type {?Phaser.Geom.Rectangle}
         * @since 3.20
         */
        this.customBoundsRectangle = world.bounds;

        //  If true this Body will dispatch events

        /**
         * Whether the simulation emits a `worldbounds` event when this Body collides with the world boundary (and `collideWorldBounds` is also true).
         *
         * @name Phaser.Physics.Arcade.Body#onWorldBounds
         * @type {boolean}
         * @default false
         * @since 3.0.0
         * @see Phaser.Physics.Arcade.World#worldboundsEvent
         */
        this.onWorldBounds = false;

        /**
         * Whether the simulation emits a `collide` event when this Body collides with another.
         *
         * @name Phaser.Physics.Arcade.Body#onCollide
         * @type {boolean}
         * @default false
         * @since 3.0.0
         * @see Phaser.Physics.Arcade.World#collideEvent
         */
        this.onCollide = false;

        /**
         * Whether the simulation emits an `overlap` event when this Body overlaps with another.
         *
         * @name Phaser.Physics.Arcade.Body#onOverlap
         * @type {boolean}
         * @default false
         * @since 3.0.0
         * @see Phaser.Physics.Arcade.World#overlapEvent
         */
        this.onOverlap = false;

        /**
         * The Body's absolute maximum velocity, in pixels per second.
         * The horizontal and vertical components are applied separately.
         *
         * @name Phaser.Physics.Arcade.Body#maxVelocity
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.maxVelocity = new Vector2(10000, 10000);

        /**
         * The maximum speed this Body is allowed to reach, in pixels per second.
         *
         * If not negative it limits the scalar value of speed.
         *
         * Any negative value means no maximum is being applied (the default).
         *
         * @name Phaser.Physics.Arcade.Body#maxSpeed
         * @type {number}
         * @default -1
         * @since 3.16.0
         */
        this.maxSpeed = -1;

        /**
         * If this Body is `immovable` and in motion, `friction` is the proportion of this Body's motion received by the riding Body on each axis, relative to 1.
         * The horizontal component (x) is applied only when two colliding Bodies are separated vertically.
         * The vertical component (y) is applied only when two colliding Bodies are separated horizontally.
         * The default value (1, 0) moves the riding Body horizontally in equal proportion to this Body and vertically not at all.
         *
         * @name Phaser.Physics.Arcade.Body#friction
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.friction = new Vector2(1, 0);

        /**
         * If this Body is using `drag` for deceleration this property controls how the drag is applied.
         * If set to `true` drag will use a damping effect rather than a linear approach. If you are
         * creating a game where the Body moves freely at any angle (i.e. like the way the ship moves in
         * the game Asteroids) then you will get a far smoother and more visually correct deceleration
         * by using damping, avoiding the axis-drift that is prone with linear deceleration.
         *
         * If you enable this property then you should use far smaller `drag` values than with linear, as
         * they are used as a multiplier on the velocity. Values such as 0.95 will give a nice slow
         * deceleration, where-as smaller values, such as 0.5 will stop an object almost immediately.
         *
         * @name Phaser.Physics.Arcade.Body#useDamping
         * @type {boolean}
         * @default false
         * @since 3.10.0
         */
        this.useDamping = false;

        /**
         * The rate of change of this Body's `rotation`, in degrees per second.
         *
         * @name Phaser.Physics.Arcade.Body#angularVelocity
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.angularVelocity = 0;

        /**
         * The Body's angular acceleration (change in angular velocity), in degrees per second squared.
         *
         * @name Phaser.Physics.Arcade.Body#angularAcceleration
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.angularAcceleration = 0;

        /**
         * Loss of angular velocity due to angular movement, in degrees per second.
         *
         * Angular drag is applied only when angular acceleration is zero.
         *
         * @name Phaser.Physics.Arcade.Body#angularDrag
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.angularDrag = 0;

        /**
         * The Body's maximum angular velocity, in degrees per second.
         *
         * @name Phaser.Physics.Arcade.Body#maxAngular
         * @type {number}
         * @default 1000
         * @since 3.0.0
         */
        this.maxAngular = 1000;

        /**
         * The Body's inertia, relative to a default unit (1).
         * With `bounce`, this affects the exchange of momentum (velocities) during collisions.
         *
         * @name Phaser.Physics.Arcade.Body#mass
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.mass = 1;

        /**
         * The calculated angle of this Body's velocity vector, in radians, during the last step.
         *
         * @name Phaser.Physics.Arcade.Body#angle
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.angle = 0;

        /**
         * The calculated magnitude of the Body's velocity, in pixels per second, during the last step.
         *
         * @name Phaser.Physics.Arcade.Body#speed
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.speed = 0;

        /**
         * The direction of the Body's velocity, as calculated during the last step.
         * If the Body is moving on both axes (diagonally), this describes motion on the vertical axis only.
         *
         * @name Phaser.Physics.Arcade.Body#facing
         * @type {integer}
         * @since 3.0.0
         */
        this.facing = CONST.FACING_NONE;

        /**
         * Whether this Body can be moved by collisions with another Body.
         *
         * @name Phaser.Physics.Arcade.Body#immovable
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.immovable = false;

        /**
         * Whether the Body's position and rotation are affected by its velocity, acceleration, drag, and gravity.
         *
         * @name Phaser.Physics.Arcade.Body#moves
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.moves = true;

        /**
         * A flag disabling the default horizontal separation of colliding bodies.
         * Pass your own `collideCallback` to the collider.
         *
         * @name Phaser.Physics.Arcade.Body#customSeparateX
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.customSeparateX = false;

        /**
         * A flag disabling the default vertical separation of colliding bodies.
         * Pass your own `collideCallback` to the collider.
         *
         * @name Phaser.Physics.Arcade.Body#customSeparateY
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.customSeparateY = false;

        /**
         * The amount of horizontal overlap (before separation), if this Body is colliding with another.
         *
         * @name Phaser.Physics.Arcade.Body#overlapX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.overlapX = 0;

        /**
         * The amount of vertical overlap (before separation), if this Body is colliding with another.
         *
         * @name Phaser.Physics.Arcade.Body#overlapY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.overlapY = 0;

        /**
         * The amount of overlap (before separation), if this Body is circular and colliding with another circular body.
         *
         * @name Phaser.Physics.Arcade.Body#overlapR
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.overlapR = 0;

        /**
         * Whether this Body is overlapped with another and both are not moving, on at least one axis.
         *
         * @name Phaser.Physics.Arcade.Body#embedded
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.embedded = false;

        /**
         * Whether this Body interacts with the world boundary.
         *
         * @name Phaser.Physics.Arcade.Body#collideWorldBounds
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.collideWorldBounds = false;

        /**
         * Whether this Body is checked for collisions and for which directions.
         * You can set `checkCollision.none = true` to disable collision checks.
         *
         * @name Phaser.Physics.Arcade.Body#checkCollision
         * @type {Phaser.Types.Physics.Arcade.ArcadeBodyCollision}
         * @since 3.0.0
         */
        this.checkCollision = { none: false, up: true, down: true, left: true, right: true };

        /**
         * Whether this Body is colliding with a Body or Static Body and in which direction.
         * In a collision where both bodies have zero velocity, `embedded` will be set instead.
         *
         * @name Phaser.Physics.Arcade.Body#touching
         * @type {Phaser.Types.Physics.Arcade.ArcadeBodyCollision}
         * @since 3.0.0
         *
         * @see Phaser.Physics.Arcade.Body#blocked
         * @see Phaser.Physics.Arcade.Body#embedded
         */
        this.touching = { none: true, up: false, down: false, left: false, right: false };

        /**
         * This Body's `touching` value during the previous step.
         *
         * @name Phaser.Physics.Arcade.Body#wasTouching
         * @type {Phaser.Types.Physics.Arcade.ArcadeBodyCollision}
         * @since 3.0.0
         *
         * @see Phaser.Physics.Arcade.Body#touching
         */
        this.wasTouching = { none: true, up: false, down: false, left: false, right: false };

        /**
         * Whether this Body is colliding with a Static Body, a tile, or the world boundary.
         * In a collision with a Static Body, if this Body has zero velocity then `embedded` will be set instead.
         *
         * @name Phaser.Physics.Arcade.Body#blocked
         * @type {Phaser.Types.Physics.Arcade.ArcadeBodyCollision}
         * @since 3.0.0
         *
         * @see Phaser.Physics.Arcade.Body#embedded
         * @see Phaser.Physics.Arcade.Body#touching
         */
        this.blocked = { none: true, up: false, down: false, left: false, right: false };

        /**
         * Whether to automatically synchronize this Body's dimensions to the dimensions of its Game Object's visual bounds.
         *
         * @name Phaser.Physics.Arcade.Body#syncBounds
         * @type {boolean}
         * @default false
         * @since 3.0.0
         * @see Phaser.GameObjects.Components.GetBounds#getBounds
         */
        this.syncBounds = false;

        /**
         * The Body's physics type (dynamic or static).
         *
         * @name Phaser.Physics.Arcade.Body#physicsType
         * @type {integer}
         * @readonly
         * @default Phaser.Physics.Arcade.DYNAMIC_BODY
         * @since 3.0.0
         */
        this.physicsType = CONST.DYNAMIC_BODY;

        /**
         * Cached horizontal scale of the Body's Game Object.
         *
         * @name Phaser.Physics.Arcade.Body#_sx
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._sx = gameObject.scaleX;

        /**
         * Cached vertical scale of the Body's Game Object.
         *
         * @name Phaser.Physics.Arcade.Body#_sy
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._sy = gameObject.scaleY;

        /**
         * The calculated change in the Body's horizontal position during the last step.
         *
         * @name Phaser.Physics.Arcade.Body#_dx
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._dx = 0;

        /**
         * The calculated change in the Body's vertical position during the last step.
         *
         * @name Phaser.Physics.Arcade.Body#_dy
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._dy = 0;

        /**
         * The final calculated change in the Body's horizontal position as of `postUpdate`.
         *
         * @name Phaser.Physics.Arcade.Body#_tx
         * @type {number}
         * @private
         * @default 0
         * @since 3.22.0
         */
        this._tx = 0;

        /**
         * The final calculated change in the Body's vertical position as of `postUpdate`.
         *
         * @name Phaser.Physics.Arcade.Body#_ty
         * @type {number}
         * @private
         * @default 0
         * @since 3.22.0
         */
        this._ty = 0;

        /**
         * Stores the Game Object's bounds.
         *
         * @name Phaser.Physics.Arcade.Body#_bounds
         * @type {Phaser.Geom.Rectangle}
         * @private
         * @since 3.0.0
         */
        this._bounds = new Rectangle();
    },

    /**
     * Updates the Body's `transform`, `width`, `height`, and `center` from its Game Object.
     * The Body's `position` isn't changed.
     *
     * @method Phaser.Physics.Arcade.Body#updateBounds
     * @since 3.0.0
     */
    updateBounds: function ()
    {
        var sprite = this.gameObject;

        //  Container?

        var transform = this.transform;

        if (sprite.parentContainer)
        {
            var matrix = sprite.getWorldTransformMatrix(this.world._tempMatrix, this.world._tempMatrix2);

            transform.x = matrix.tx;
            transform.y = matrix.ty;
            transform.rotation = RadToDeg(matrix.rotation);
            transform.scaleX = matrix.scaleX;
            transform.scaleY = matrix.scaleY;
            transform.displayOriginX = sprite.displayOriginX;
            transform.displayOriginY = sprite.displayOriginY;
        }
        else
        {
            transform.x = sprite.x;
            transform.y = sprite.y;
            transform.rotation = sprite.angle;
            transform.scaleX = sprite.scaleX;
            transform.scaleY = sprite.scaleY;
            transform.displayOriginX = sprite.displayOriginX;
            transform.displayOriginY = sprite.displayOriginY;
        }

        var recalc = false;

        if (this.syncBounds)
        {
            var b = sprite.getBounds(this._bounds);

            this.width = b.width;
            this.height = b.height;
            recalc = true;
        }
        else
        {
            var asx = Math.abs(transform.scaleX);
            var asy = Math.abs(transform.scaleY);

            if (this._sx !== asx || this._sy !== asy)
            {
                this.width = this.sourceWidth * asx;
                this.height = this.sourceHeight * asy;
                this._sx = asx;
                this._sy = asy;
                recalc = true;
            }
        }

        if (recalc)
        {
            this.halfWidth = Math.floor(this.width / 2);
            this.halfHeight = Math.floor(this.height / 2);
            this.updateCenter();
        }
    },

    /**
     * Updates the Body's `center` from its `position`, `width`, and `height`.
     *
     * @method Phaser.Physics.Arcade.Body#updateCenter
     * @since 3.0.0
     */
    updateCenter: function ()
    {
        this.center.set(this.position.x + this.halfWidth, this.position.y + this.halfHeight);
    },

    /**
     * Prepares the Body for a physics step by resetting the `wasTouching`, `touching` and `blocked` states.
     *
     * This method is only called if the physics world is going to run a step this frame.
     *
     * @method Phaser.Physics.Arcade.Body#resetFlags
     * @since 3.18.0
     */
    resetFlags: function ()
    {
        //  Store and reset collision flags
        this.wasTouching.none = this.touching.none;
        this.wasTouching.up = this.touching.up;
        this.wasTouching.down = this.touching.down;
        this.wasTouching.left = this.touching.left;
        this.wasTouching.right = this.touching.right;

        this.touching.none = true;
        this.touching.up = false;
        this.touching.down = false;
        this.touching.left = false;
        this.touching.right = false;

        this.blocked.none = true;
        this.blocked.up = false;
        this.blocked.down = false;
        this.blocked.left = false;
        this.blocked.right = false;

        this.overlapR = 0;
        this.overlapX = 0;
        this.overlapY = 0;

        this.embedded = false;
    },

    /**
     * Syncs the position body position with the parent Game Object.
     *
     * This method is called every game frame, regardless if the world steps or not.
     *
     * @method Phaser.Physics.Arcade.Body#preUpdate
     * @since 3.17.0
     *
     * @param {boolean} willStep - Will this Body run an update as well?
     * @param {number} delta - The delta time, in seconds, elapsed since the last frame.
     */
    preUpdate: function (willStep, delta)
    {
        if (willStep)
        {
            this.resetFlags();
        }

        this.updateBounds();

        var sprite = this.transform;

        this.position.x = sprite.x + sprite.scaleX * (this.offset.x - sprite.displayOriginX);
        this.position.y = sprite.y + sprite.scaleY * (this.offset.y - sprite.displayOriginY);

        this.updateCenter();

        this.rotation = sprite.rotation;

        this.preRotation = this.rotation;

        if (this.moves)
        {
            this.prev.x = this.position.x;
            this.prev.y = this.position.y;
            this.prevFrame.x = this.position.x;
            this.prevFrame.y = this.position.y;
        }

        if (willStep)
        {
            this.update(delta);
        }
    },

    /**
     * Performs a single physics step and updates the body velocity, angle, speed and other properties.
     *
     * This method can be called multiple times per game frame, depending on the physics step rate.
     *
     * The results are synced back to the Game Object in `postUpdate`.
     *
     * @method Phaser.Physics.Arcade.Body#update
     * @fires Phaser.Physics.Arcade.Events#WORLD_BOUNDS
     * @since 3.0.0
     *
     * @param {number} delta - The delta time, in seconds, elapsed since the last frame.
     */
    update: function (delta)
    {
        this.prev.x = this.position.x;
        this.prev.y = this.position.y;

        if (this.moves)
        {
            this.world.updateMotion(this, delta);

            var vx = this.velocity.x;
            var vy = this.velocity.y;

            this.newVelocity.set(vx * delta, vy * delta);

            this.position.add(this.newVelocity);

            this.updateCenter();

            this.angle = Math.atan2(vy, vx);
            this.speed = Math.sqrt(vx * vx + vy * vy);

            //  Now the update will throw collision checks at the Body
            //  And finally we'll integrate the new position back to the Sprite in postUpdate

            if (this.collideWorldBounds && this.checkWorldBounds() && this.onWorldBounds)
            {
                this.world.emit(Events.WORLD_BOUNDS, this, this.blocked.up, this.blocked.down, this.blocked.left, this.blocked.right);
            }
        }

        this._dx = this.position.x - this.prev.x;
        this._dy = this.position.y - this.prev.y;
    },

    /**
     * Feeds the Body results back into the parent Game Object.
     *
     * This method is called every game frame, regardless if the world steps or not.
     *
     * @method Phaser.Physics.Arcade.Body#postUpdate
     * @since 3.0.0
     */
    postUpdate: function ()
    {
        var dx = this.position.x - this.prevFrame.x;
        var dy = this.position.y - this.prevFrame.y;

        if (this.moves)
        {
            var mx = this.deltaMax.x;
            var my = this.deltaMax.y;

            if (mx !== 0 && dx !== 0)
            {
                if (dx < 0 && dx < -mx)
                {
                    dx = -mx;
                }
                else if (dx > 0 && dx > mx)
                {
                    dx = mx;
                }
            }

            if (my !== 0 && dy !== 0)
            {
                if (dy < 0 && dy < -my)
                {
                    dy = -my;
                }
                else if (dy > 0 && dy > my)
                {
                    dy = my;
                }
            }

            this.gameObject.x += dx;
            this.gameObject.y += dy;
        }

        if (dx < 0)
        {
            this.facing = CONST.FACING_LEFT;
        }
        else if (dx > 0)
        {
            this.facing = CONST.FACING_RIGHT;
        }

        if (dy < 0)
        {
            this.facing = CONST.FACING_UP;
        }
        else if (dy > 0)
        {
            this.facing = CONST.FACING_DOWN;
        }

        if (this.allowRotation)
        {
            this.gameObject.angle += this.deltaZ();
        }

        this._tx = dx;
        this._ty = dy;
    },

    /**
     * Sets a custom collision boundary rectangle. Use if you want to have a custom
     * boundary instead of the world boundaries.
     *
     * @method Phaser.Physics.Arcade.Body#setBoundsRectangle
     * @since 3.20
     *
     * @param {?Phaser.Geom.Rectangle} [bounds] - The new boundary rectangle. Pass `null` to use the World bounds.
     * 
     * @return {this} This Body object.
     */
    setBoundsRectangle: function (bounds)
    {
        this.customBoundsRectangle = (!bounds) ? this.world.bounds : bounds;

        return this;
    },

    /**
     * Checks for collisions between this Body and the world boundary and separates them.
     *
     * @method Phaser.Physics.Arcade.Body#checkWorldBounds
     * @since 3.0.0
     *
     * @return {boolean} True if this Body is colliding with the world boundary.
     */
    checkWorldBounds: function ()
    {
        var pos = this.position;
        var bounds = this.customBoundsRectangle;
        var check = this.world.checkCollision;

        var bx = (this.worldBounce) ? -this.worldBounce.x : -this.bounce.x;
        var by = (this.worldBounce) ? -this.worldBounce.y : -this.bounce.y;

        var wasSet = false;

        if (pos.x < bounds.x && check.left)
        {
            pos.x = bounds.x;
            this.velocity.x *= bx;
            this.blocked.left = true;
            wasSet = true;
        }
        else if (this.right > bounds.right && check.right)
        {
            pos.x = bounds.right - this.width;
            this.velocity.x *= bx;
            this.blocked.right = true;
            wasSet = true;
        }

        if (pos.y < bounds.y && check.up)
        {
            pos.y = bounds.y;
            this.velocity.y *= by;
            this.blocked.up = true;
            wasSet = true;
        }
        else if (this.bottom > bounds.bottom && check.down)
        {
            pos.y = bounds.bottom - this.height;
            this.velocity.y *= by;
            this.blocked.down = true;
            wasSet = true;
        }

        if (wasSet)
        {
            this.blocked.none = false;
        }

        return wasSet;
    },

    /**
     * Sets the offset of the Body's position from its Game Object's position.
     *
     * @method Phaser.Physics.Arcade.Body#setOffset
     * @since 3.0.0
     *
     * @param {number} x - The horizontal offset, in source pixels.
     * @param {number} [y=x] - The vertical offset, in source pixels.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setOffset: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.offset.set(x, y);
        this.updateCenter();

        return this;
    },

    /**
     * Sizes and positions this Body's boundary, as a rectangle.
     * Modifies the Body `offset` if `center` is true (the default).
     * Resets the width and height to match current frame, if no width and height provided and a frame is found.
     *
     * @method Phaser.Physics.Arcade.Body#setSize
     * @since 3.0.0
     *
     * @param {integer} [width] - The width of the Body in pixels. Cannot be zero. If not given, and the parent Game Object has a frame, it will use the frame width.
     * @param {integer} [height] - The height of the Body in pixels. Cannot be zero. If not given, and the parent Game Object has a frame, it will use the frame height.
     * @param {boolean} [center=true] - Modify the Body's `offset`, placing the Body's center on its Game Object's center. Only works if the Game Object has the `getCenter` method.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setSize: function (width, height, center)
    {
        if (center === undefined) { center = true; }

        var gameObject = this.gameObject;

        if (!width && gameObject.frame)
        {
            width = gameObject.frame.realWidth;
        }

        if (!height && gameObject.frame)
        {
            height = gameObject.frame.realHeight;
        }

        this.sourceWidth = width;
        this.sourceHeight = height;

        this.width = this.sourceWidth * this._sx;
        this.height = this.sourceHeight * this._sy;

        this.halfWidth = Math.floor(this.width / 2);
        this.halfHeight = Math.floor(this.height / 2);

        this.updateCenter();

        if (center && gameObject.getCenter)
        {
            var ox = gameObject.displayWidth / 2;
            var oy = gameObject.displayHeight / 2;

            this.offset.set(ox - this.halfWidth, oy - this.halfHeight);
        }

        this.isCircle = false;
        this.radius = 0;

        return this;
    },

    /**
     * Sizes and positions this Body's boundary, as a circle.
     *
     * @method Phaser.Physics.Arcade.Body#setCircle
     * @since 3.0.0
     *
     * @param {number} radius - The radius of the Body, in source pixels.
     * @param {number} [offsetX] - The horizontal offset of the Body from its Game Object, in source pixels.
     * @param {number} [offsetY] - The vertical offset of the Body from its Game Object, in source pixels.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setCircle: function (radius, offsetX, offsetY)
    {
        if (offsetX === undefined) { offsetX = this.offset.x; }
        if (offsetY === undefined) { offsetY = this.offset.y; }

        if (radius > 0)
        {
            this.isCircle = true;
            this.radius = radius;

            this.sourceWidth = radius * 2;
            this.sourceHeight = radius * 2;

            this.width = this.sourceWidth * this._sx;
            this.height = this.sourceHeight * this._sy;

            this.halfWidth = Math.floor(this.width / 2);
            this.halfHeight = Math.floor(this.height / 2);

            this.offset.set(offsetX, offsetY);

            this.updateCenter();
        }
        else
        {
            this.isCircle = false;
        }

        return this;
    },

    /**
     * Resets this Body to the given coordinates. Also positions its parent Game Object to the same coordinates.
     * If the Body had any velocity or acceleration it is lost as a result of calling this.
     *
     * @method Phaser.Physics.Arcade.Body#reset
     * @since 3.0.0
     *
     * @param {number} x - The horizontal position to place the Game Object and Body.
     * @param {number} y - The vertical position to place the Game Object and Body.
     */
    reset: function (x, y)
    {
        this.stop();

        var gameObject = this.gameObject;

        gameObject.setPosition(x, y);

        if (gameObject.getTopLeft)
        {
            gameObject.getTopLeft(this.position);
        }
        else
        {
            this.position.set(x, y);
        }

        this.prev.copy(this.position);
        this.prevFrame.copy(this.position);

        this.rotation = gameObject.angle;
        this.preRotation = gameObject.angle;

        this.updateBounds();
        this.updateCenter();
    },

    /**
     * Sets acceleration, velocity, and speed to zero.
     *
     * @method Phaser.Physics.Arcade.Body#stop
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    stop: function ()
    {
        this.velocity.set(0);
        this.acceleration.set(0);
        this.speed = 0;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;

        return this;
    },

    /**
     * Copies the coordinates of this Body's edges into an object.
     *
     * @method Phaser.Physics.Arcade.Body#getBounds
     * @since 3.0.0
     *
     * @param {Phaser.Types.Physics.Arcade.ArcadeBodyBounds} obj - An object to copy the values into.
     *
     * @return {Phaser.Types.Physics.Arcade.ArcadeBodyBounds} - An object with {x, y, right, bottom}.
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
     * Tests if the coordinates are within this Body's boundary.
     *
     * @method Phaser.Physics.Arcade.Body#hitTest
     * @since 3.0.0
     *
     * @param {number} x - The horizontal coordinate.
     * @param {number} y - The vertical coordinate.
     *
     * @return {boolean} True if (x, y) is within this Body.
     */
    hitTest: function (x, y)
    {
        if (!this.isCircle)
        {
            return RectangleContains(this, x, y);
        }

        //  Check if x/y are within the bounds first
        if (this.radius > 0 && x >= this.left && x <= this.right && y >= this.top && y <= this.bottom)
        {
            var dx = (this.center.x - x) * (this.center.x - x);
            var dy = (this.center.y - y) * (this.center.y - y);

            return (dx + dy) <= (this.radius * this.radius);
        }

        return false;
    },

    /**
     * Whether this Body is touching a tile or the world boundary while moving down.
     *
     * @method Phaser.Physics.Arcade.Body#onFloor
     * @since 3.0.0
     * @see Phaser.Physics.Arcade.Body#blocked
     *
     * @return {boolean} True if touching.
     */
    onFloor: function ()
    {
        return this.blocked.down;
    },

    /**
     * Whether this Body is touching a tile or the world boundary while moving up.
     *
     * @method Phaser.Physics.Arcade.Body#onCeiling
     * @since 3.0.0
     * @see Phaser.Physics.Arcade.Body#blocked
     *
     * @return {boolean} True if touching.
     */
    onCeiling: function ()
    {
        return this.blocked.up;
    },

    /**
     * Whether this Body is touching a tile or the world boundary while moving left or right.
     *
     * @method Phaser.Physics.Arcade.Body#onWall
     * @since 3.0.0
     * @see Phaser.Physics.Arcade.Body#blocked
     *
     * @return {boolean} True if touching.
     */
    onWall: function ()
    {
        return (this.blocked.left || this.blocked.right);
    },

    /**
     * The absolute (non-negative) change in this Body's horizontal position from the previous step.
     *
     * @method Phaser.Physics.Arcade.Body#deltaAbsX
     * @since 3.0.0
     *
     * @return {number} The delta value.
     */
    deltaAbsX: function ()
    {
        return (this._dx > 0) ? this._dx : -this._dx;
    },

    /**
     * The absolute (non-negative) change in this Body's vertical position from the previous step.
     *
     * @method Phaser.Physics.Arcade.Body#deltaAbsY
     * @since 3.0.0
     *
     * @return {number} The delta value.
     */
    deltaAbsY: function ()
    {
        return (this._dy > 0) ? this._dy : -this._dy;
    },

    /**
     * The change in this Body's horizontal position from the previous step.
     * This value is set during the Body's update phase.
     * 
     * As a Body can update multiple times per step this may not hold the final
     * delta value for the Body. In this case, please see the `deltaXFinal` method.
     *
     * @method Phaser.Physics.Arcade.Body#deltaX
     * @since 3.0.0
     *
     * @return {number} The delta value.
     */
    deltaX: function ()
    {
        return this._dx;
    },

    /**
     * The change in this Body's vertical position from the previous step.
     * This value is set during the Body's update phase.
     * 
     * As a Body can update multiple times per step this may not hold the final
     * delta value for the Body. In this case, please see the `deltaYFinal` method.
     *
     * @method Phaser.Physics.Arcade.Body#deltaY
     * @since 3.0.0
     *
     * @return {number} The delta value.
     */
    deltaY: function ()
    {
        return this._dy;
    },

    /**
     * The change in this Body's horizontal position from the previous game update.
     * 
     * This value is set during the `postUpdate` phase and takes into account the
     * `deltaMax` and final position of the Body.
     * 
     * Because this value is not calculated until `postUpdate`, you must listen for it
     * during a Scene `POST_UPDATE` or `RENDER` event, and not in `update`, as it will
     * not be calculated by that point. If you _do_ use these values in `update` they
     * will represent the delta from the _previous_ game frame.
     *
     * @method Phaser.Physics.Arcade.Body#deltaXFinal
     * @since 3.22.0
     *
     * @return {number} The final delta x value.
     */
    deltaXFinal: function ()
    {
        return this._tx;
    },

    /**
     * The change in this Body's vertical position from the previous game update.
     * 
     * This value is set during the `postUpdate` phase and takes into account the
     * `deltaMax` and final position of the Body.
     * 
     * Because this value is not calculated until `postUpdate`, you must listen for it
     * during a Scene `POST_UPDATE` or `RENDER` event, and not in `update`, as it will
     * not be calculated by that point. If you _do_ use these values in `update` they
     * will represent the delta from the _previous_ game frame.
     *
     * @method Phaser.Physics.Arcade.Body#deltaYFinal
     * @since 3.22.0
     *
     * @return {number} The final delta y value.
     */
    deltaYFinal: function ()
    {
        return this._ty;
    },

    /**
     * The change in this Body's rotation from the previous step, in degrees.
     *
     * @method Phaser.Physics.Arcade.Body#deltaZ
     * @since 3.0.0
     *
     * @return {number} The delta value.
     */
    deltaZ: function ()
    {
        return this.rotation - this.preRotation;
    },

    /**
     * Disables this Body and marks it for deletion by the simulation.
     *
     * @method Phaser.Physics.Arcade.Body#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.enable = false;

        if (this.world)
        {
            this.world.pendingDestroy.set(this);
        }
    },

    /**
     * Draws this Body's boundary and velocity, if enabled.
     *
     * @method Phaser.Physics.Arcade.Body#drawDebug
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Graphics} graphic - The Graphics object to draw on.
     */
    drawDebug: function (graphic)
    {
        var pos = this.position;

        var x = pos.x + this.halfWidth;
        var y = pos.y + this.halfHeight;

        if (this.debugShowBody)
        {
            graphic.lineStyle(graphic.defaultStrokeWidth, this.debugBodyColor);

            if (this.isCircle)
            {
                graphic.strokeCircle(x, y, this.width / 2);
            }
            else
            {
                //  Only draw the sides where checkCollision is true, similar to debugger in layer
                if (this.checkCollision.up)
                {
                    graphic.lineBetween(pos.x, pos.y, pos.x + this.width, pos.y);
                }

                if (this.checkCollision.right)
                {
                    graphic.lineBetween(pos.x + this.width, pos.y, pos.x + this.width, pos.y + this.height);
                }

                if (this.checkCollision.down)
                {
                    graphic.lineBetween(pos.x, pos.y + this.height, pos.x + this.width, pos.y + this.height);
                }

                if (this.checkCollision.left)
                {
                    graphic.lineBetween(pos.x, pos.y, pos.x, pos.y + this.height);
                }
            }
        }

        if (this.debugShowVelocity)
        {
            graphic.lineStyle(graphic.defaultStrokeWidth, this.world.defaults.velocityDebugColor, 1);
            graphic.lineBetween(x, y, x + this.velocity.x / 2, y + this.velocity.y / 2);
        }
    },

    /**
     * Whether this Body will be drawn to the debug display.
     *
     * @method Phaser.Physics.Arcade.Body#willDrawDebug
     * @since 3.0.0
     *
     * @return {boolean} True if either `debugShowBody` or `debugShowVelocity` are enabled.
     */
    willDrawDebug: function ()
    {
        return (this.debugShowBody || this.debugShowVelocity);
    },

    /**
     * Sets whether this Body collides with the world boundary.
     *
     * Optionally also sets the World Bounce values. If the `Body.worldBounce` is null, it's set to a new Phaser.Math.Vector2 first.
     *
     * @method Phaser.Physics.Arcade.Body#setCollideWorldBounds
     * @since 3.0.0
     *
     * @param {boolean} [value=true] - `true` if this body should collide with the world bounds, otherwise `false`.
     * @param {number} [bounceX] - If given this will be replace the `worldBounce.x` value.
     * @param {number} [bounceY] - If given this will be replace the `worldBounce.y` value.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setCollideWorldBounds: function (value, bounceX, bounceY)
    {
        if (value === undefined) { value = true; }

        this.collideWorldBounds = value;

        var setBounceX = (bounceX !== undefined);
        var setBounceY = (bounceY !== undefined);

        if (setBounceX || setBounceY)
        {
            if (!this.worldBounce)
            {
                this.worldBounce = new Vector2();
            }

            if (setBounceX)
            {
                this.worldBounce.x = bounceX;
            }

            if (setBounceY)
            {
                this.worldBounce.y = bounceY;
            }
        }

        return this;
    },

    /**
     * Sets the Body's velocity.
     *
     * @method Phaser.Physics.Arcade.Body#setVelocity
     * @since 3.0.0
     *
     * @param {number} x - The horizontal velocity, in pixels per second.
     * @param {number} [y=x] - The vertical velocity, in pixels per second.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setVelocity: function (x, y)
    {
        this.velocity.set(x, y);

        x = this.velocity.x;
        y = this.velocity.y;

        this.speed = Math.sqrt(x * x + y * y);

        return this;
    },

    /**
     * Sets the Body's horizontal velocity.
     *
     * @method Phaser.Physics.Arcade.Body#setVelocityX
     * @since 3.0.0
     *
     * @param {number} value - The velocity, in pixels per second.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setVelocityX: function (value)
    {
        this.velocity.x = value;

        var x = value;
        var y = this.velocity.y;

        this.speed = Math.sqrt(x * x + y * y);

        return this;
    },

    /**
     * Sets the Body's vertical velocity.
     *
     * @method Phaser.Physics.Arcade.Body#setVelocityY
     * @since 3.0.0
     *
     * @param {number} value - The velocity, in pixels per second.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setVelocityY: function (value)
    {
        this.velocity.y = value;

        var x = this.velocity.x;
        var y = value;

        this.speed = Math.sqrt(x * x + y * y);

        return this;
    },

    /**
     * Sets the Body's maximum velocity.
     *
     * @method Phaser.Physics.Arcade.Body#setMaxVelocity
     * @since 3.10.0
     *
     * @param {number} x - The horizontal velocity, in pixels per second.
     * @param {number} [y=x] - The vertical velocity, in pixels per second.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setMaxVelocity: function (x, y)
    {
        this.maxVelocity.set(x, y);

        return this;
    },

    /**
     * Sets the maximum speed the Body can move.
     *
     * @method Phaser.Physics.Arcade.Body#setMaxSpeed
     * @since 3.16.0
     *
     * @param {number} value - The maximum speed value, in pixels per second. Set to a negative value to disable.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setMaxSpeed: function (value)
    {
        this.maxSpeed = value;

        return this;
    },

    /**
     * Sets the Body's bounce.
     *
     * @method Phaser.Physics.Arcade.Body#setBounce
     * @since 3.0.0
     *
     * @param {number} x - The horizontal bounce, relative to 1.
     * @param {number} y - The vertical bounce, relative to 1.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setBounce: function (x, y)
    {
        this.bounce.set(x, y);

        return this;
    },

    /**
     * Sets the Body's horizontal bounce.
     *
     * @method Phaser.Physics.Arcade.Body#setBounceX
     * @since 3.0.0
     *
     * @param {number} value - The bounce, relative to 1.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setBounceX: function (value)
    {
        this.bounce.x = value;

        return this;
    },

    /**
     * Sets the Body's vertical bounce.
     *
     * @method Phaser.Physics.Arcade.Body#setBounceY
     * @since 3.0.0
     *
     * @param {number} value - The bounce, relative to 1.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setBounceY: function (value)
    {
        this.bounce.y = value;

        return this;
    },

    /**
     * Sets the Body's acceleration.
     *
     * @method Phaser.Physics.Arcade.Body#setAcceleration
     * @since 3.0.0
     *
     * @param {number} x - The horizontal component, in pixels per second squared.
     * @param {number} y - The vertical component, in pixels per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAcceleration: function (x, y)
    {
        this.acceleration.set(x, y);

        return this;
    },

    /**
     * Sets the Body's horizontal acceleration.
     *
     * @method Phaser.Physics.Arcade.Body#setAccelerationX
     * @since 3.0.0
     *
     * @param {number} value - The acceleration, in pixels per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAccelerationX: function (value)
    {
        this.acceleration.x = value;

        return this;
    },

    /**
     * Sets the Body's vertical acceleration.
     *
     * @method Phaser.Physics.Arcade.Body#setAccelerationY
     * @since 3.0.0
     *
     * @param {number} value - The acceleration, in pixels per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAccelerationY: function (value)
    {
        this.acceleration.y = value;

        return this;
    },

    /**
     * Enables or disables drag.
     *
     * @method Phaser.Physics.Arcade.Body#setAllowDrag
     * @since 3.9.0
     * @see Phaser.Physics.Arcade.Body#allowDrag
     *
     * @param {boolean} [value=true] - `true` to allow drag on this body, or `false` to disable it.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAllowDrag: function (value)
    {
        if (value === undefined) { value = true; }

        this.allowDrag = value;

        return this;
    },

    /**
     * Enables or disables gravity's effect on this Body.
     *
     * @method Phaser.Physics.Arcade.Body#setAllowGravity
     * @since 3.9.0
     * @see Phaser.Physics.Arcade.Body#allowGravity
     *
     * @param {boolean} [value=true] - `true` to allow gravity on this body, or `false` to disable it.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAllowGravity: function (value)
    {
        if (value === undefined) { value = true; }

        this.allowGravity = value;

        return this;
    },

    /**
     * Enables or disables rotation.
     *
     * @method Phaser.Physics.Arcade.Body#setAllowRotation
     * @since 3.9.0
     * @see Phaser.Physics.Arcade.Body#allowRotation
     *
     * @param {boolean} [value=true] - `true` to allow rotation on this body, or `false` to disable it.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAllowRotation: function (value)
    {
        if (value === undefined) { value = true; }

        this.allowRotation = value;

        return this;
    },

    /**
     * Sets the Body's drag.
     *
     * @method Phaser.Physics.Arcade.Body#setDrag
     * @since 3.0.0
     *
     * @param {number} x - The horizontal component, in pixels per second squared.
     * @param {number} y - The vertical component, in pixels per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setDrag: function (x, y)
    {
        this.drag.set(x, y);

        return this;
    },

    /**
     * Sets the Body's horizontal drag.
     *
     * @method Phaser.Physics.Arcade.Body#setDragX
     * @since 3.0.0
     *
     * @param {number} value - The drag, in pixels per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setDragX: function (value)
    {
        this.drag.x = value;

        return this;
    },

    /**
     * Sets the Body's vertical drag.
     *
     * @method Phaser.Physics.Arcade.Body#setDragY
     * @since 3.0.0
     *
     * @param {number} value - The drag, in pixels per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setDragY: function (value)
    {
        this.drag.y = value;

        return this;
    },

    /**
     * Sets the Body's gravity.
     *
     * @method Phaser.Physics.Arcade.Body#setGravity
     * @since 3.0.0
     *
     * @param {number} x - The horizontal component, in pixels per second squared.
     * @param {number} y - The vertical component, in pixels per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setGravity: function (x, y)
    {
        this.gravity.set(x, y);

        return this;
    },

    /**
     * Sets the Body's horizontal gravity.
     *
     * @method Phaser.Physics.Arcade.Body#setGravityX
     * @since 3.0.0
     *
     * @param {number} value - The gravity, in pixels per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setGravityX: function (value)
    {
        this.gravity.x = value;

        return this;
    },

    /**
     * Sets the Body's vertical gravity.
     *
     * @method Phaser.Physics.Arcade.Body#setGravityY
     * @since 3.0.0
     *
     * @param {number} value - The gravity, in pixels per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setGravityY: function (value)
    {
        this.gravity.y = value;

        return this;
    },

    /**
     * Sets the Body's friction.
     *
     * @method Phaser.Physics.Arcade.Body#setFriction
     * @since 3.0.0
     *
     * @param {number} x - The horizontal component, relative to 1.
     * @param {number} y - The vertical component, relative to 1.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setFriction: function (x, y)
    {
        this.friction.set(x, y);

        return this;
    },

    /**
     * Sets the Body's horizontal friction.
     *
     * @method Phaser.Physics.Arcade.Body#setFrictionX
     * @since 3.0.0
     *
     * @param {number} value - The friction value, relative to 1.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setFrictionX: function (value)
    {
        this.friction.x = value;

        return this;
    },

    /**
     * Sets the Body's vertical friction.
     *
     * @method Phaser.Physics.Arcade.Body#setFrictionY
     * @since 3.0.0
     *
     * @param {number} value - The friction value, relative to 1.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setFrictionY: function (value)
    {
        this.friction.y = value;

        return this;
    },

    /**
     * Sets the Body's angular velocity.
     *
     * @method Phaser.Physics.Arcade.Body#setAngularVelocity
     * @since 3.0.0
     *
     * @param {number} value - The velocity, in degrees per second.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAngularVelocity: function (value)
    {
        this.angularVelocity = value;

        return this;
    },

    /**
     * Sets the Body's angular acceleration.
     *
     * @method Phaser.Physics.Arcade.Body#setAngularAcceleration
     * @since 3.0.0
     *
     * @param {number} value - The acceleration, in degrees per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAngularAcceleration: function (value)
    {
        this.angularAcceleration = value;

        return this;
    },

    /**
     * Sets the Body's angular drag.
     *
     * @method Phaser.Physics.Arcade.Body#setAngularDrag
     * @since 3.0.0
     *
     * @param {number} value - The drag, in degrees per second squared.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAngularDrag: function (value)
    {
        this.angularDrag = value;

        return this;
    },

    /**
     * Sets the Body's mass.
     *
     * @method Phaser.Physics.Arcade.Body#setMass
     * @since 3.0.0
     *
     * @param {number} value - The mass value, relative to 1.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setMass: function (value)
    {
        this.mass = value;

        return this;
    },

    /**
     * Sets the Body's `immovable` property.
     *
     * @method Phaser.Physics.Arcade.Body#setImmovable
     * @since 3.0.0
     *
     * @param {boolean} [value=true] - The value to assign to `immovable`.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setImmovable: function (value)
    {
        if (value === undefined) { value = true; }

        this.immovable = value;

        return this;
    },

    /**
     * Sets the Body's `enable` property.
     *
     * @method Phaser.Physics.Arcade.Body#setEnable
     * @since 3.15.0
     *
     * @param {boolean} [value=true] - The value to assign to `enable`.
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setEnable: function (value)
    {
        if (value === undefined) { value = true; }

        this.enable = value;

        return this;
    },

    /**
     * The Body's horizontal position (left edge).
     *
     * @name Phaser.Physics.Arcade.Body#x
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
            this.position.x = value;
        }

    },

    /**
     * The Body's vertical position (top edge).
     *
     * @name Phaser.Physics.Arcade.Body#y
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
            this.position.y = value;
        }

    },

    /**
     * The left edge of the Body's boundary. Identical to x.
     *
     * @name Phaser.Physics.Arcade.Body#left
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
     * The right edge of the Body's boundary.
     *
     * @name Phaser.Physics.Arcade.Body#right
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
     * The top edge of the Body's boundary. Identical to y.
     *
     * @name Phaser.Physics.Arcade.Body#top
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
     * The bottom edge of this Body's boundary.
     *
     * @name Phaser.Physics.Arcade.Body#bottom
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

module.exports = Body;
