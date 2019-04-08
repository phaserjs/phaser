/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var ArrayAdd = require('../../utils/array/Add');
var BaseBody = require('./BaseBody');
var CheckOverlap = require('./CheckOverlap');
var Clamp = require('../../math/Clamp');
var Class = require('../../utils/Class');
var CONST = require('./const');
var DistanceBetween = require('../../math/distance/DistanceBetween');
var Events = require('./events');
var FuzzyEqual = require('../../math/fuzzy/Equal');
var FuzzyGreaterThan = require('../../math/fuzzy/GreaterThan');
var FuzzyLessThan = require('../../math/fuzzy/LessThan');
var OverlapRect = require('./components/OverlapRect');
var RadToDeg = require('../../math/RadToDeg');
var Rectangle = require('../../geom/rectangle/Rectangle');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * A Dynamic Arcade Body.
 *
 * Its static counterpart is {@link Phaser.Physics.Arcade.StaticBody}.
 *
 * @class Body
 * @extends Phaser.Physics.Arcade.BaseBody
 * @memberof Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.World} world - The Arcade Physics simulation this Body belongs to.
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object this Body belongs to.
 */
var Body = new Class({

    Extends: BaseBody,

    initialize:

    function Body (world, gameObject, x, y, width, height)
    {
        BaseBody.call(this, world, gameObject, CONST.DYNAMIC_BODY, x, y, width, height);

        if (!gameObject)
        {
            gameObject = {
                x: x,
                y: y,
                angle: 0,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
                displayOriginX: 0.5,
                displayOriginY: 0.5
            };
        }

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
         * The Body's rotation, in degrees, during the previous step.
         *
         * @name Phaser.Physics.Arcade.Body#preRotation
         * @type {number}
         * @since 3.0.0
         */
        this.preRotation = gameObject.angle;

        /**
         * The unscaled width of the Body, in source pixels, as set by setSize().
         * The default is the width of the Body's Game Object's texture frame.
         *
         * @name Phaser.Physics.Arcade.Body#sourceWidth
         * @type {number}
         * @since 3.0.0
         * @see Phaser.Physics.Arcade.Body#setSize
         */
        this.sourceWidth = this.width;

        /**
         * The unscaled height of the Body, in source pixels, as set by setSize().
         * The default is the height of the Body's Game Object's texture frame.
         *
         * @name Phaser.Physics.Arcade.Body#sourceHeight
         * @type {number}
         * @since 3.0.0
         * @see Phaser.Physics.Arcade.Body#setSize
         */
        this.sourceHeight = this.height;

        if (gameObject.frame)
        {
            this.sourceWidth = gameObject.frame.realWidth;
            this.sourceHeight = gameObject.frame.realHeight;
        }

        /**
         * The Body's velocity, in pixels per second.
         *
         * @name Phaser.Physics.Arcade.Body#velocity
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.velocity = new Vector2();

        /**
         * The minimum velocity a body can move before it won't rebound and is considered for sleep.
         * The default is 15 but you may wish to change this based on game type.
         *
         * @name Phaser.Physics.Arcade.Body#minVelocity
         * @type {Phaser.Math.Vector2}
         * @since 3.17.0
         */
        this.minVelocity = new Vector2(15, 15);

        /**
         * The Body's velocity in the previous frame, in pixels per second.
         *
         * @name Phaser.Physics.Arcade.Body#prevVelocity
         * @type {Phaser.Math.Vector2}
         * @since 3.17.0
         */
        this.prevVelocity = new Vector2();

        /**
         * Is the Body asleep?
         *
         * @name Phaser.Physics.Arcade.Body#sleeping
         * @type {boolean}
         * @readonly
         * @since 3.17.0
         */
        this.sleeping = false;

        /**
         * Internal sleep tracking property.
         *
         * @name Phaser.Physics.Arcade.Body#_sleep
         * @private
         * @type {integer}
         * @since 3.17.0
         */
        this._sleep = 0;

        /**
         * The number of iterations before this body can fall asleep.
         *
         * @name Phaser.Physics.Arcade.Body#sleepIterations
         * @type {integer}
         * @since 3.17.0
         */
        this.sleepIterations = 60;

        /**
         * Can this Body ever fall asleep? Typically you should leave this as `true`, but some
         * bodies, such as those under the control of tweens, should never sleep.
         *
         * @name Phaser.Physics.Arcade.Body#canSleep
         * @type {boolean}
         * @since 3.17.0
         */
        this.canSleep = true;

        /**
         * The position this Body will be forced to assume during postUpdate, if any.
         * 
         * 0 = none
         * 1 = soft up
         * 2 = soft down
         * 3 = soft left
         * 4 = soft right
         * 5 = world bounds
         * 6 = hard up
         * 7 = hard down
         * 8 = hard left
         * 9 = hard right
         * 10 = riding
         *
         * @name Phaser.Physics.Arcade.Body#forcePosition
         * @private
         * @type {integer}
         * @since 3.17.0
         */
        this.forcePosition = 0;

        /**
         * The Body this one will snap to during postUpdate.
         *
         * @name Phaser.Physics.Arcade.Body#snapTo
         * @private
         * @type {Phaser.Physics.Arcade.Body}
         * @since 3.17.0
         */
        this.snapTo = null;

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
         * The Body's absolute maximum velocity, in pixels per second.
         * The horizontal and vertical components are applied separately.
         *
         * @name Phaser.Physics.Arcade.Body#maxVelocity
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.maxVelocity = new Vector2(10000, 10000);

        /**
         * The maximum speed this Body is allowed to reach.
         * 
         * If not negative it limits the scalar value of speed.
         * 
         * Any negative value means no maximum is being applied.
         * 
         * @name Phaser.Physics.Arcade.Body#maxSpeed
         * @type {number}
         * @since 3.16.0 
         */
        this.maxSpeed = -1;

        /**
         * If this Body is `immovable` and in motion, `friction` is the proportion of this Body's motion received by the riding Body on each axis, relative to 1.
         * The default value (1, 0) moves the riding Body horizontally in equal proportion to this Body and vertically not at all.
         * The horizontal component (x) is applied only when two colliding Bodies are separated vertically.
         * The vertical component (y) is applied only when two colliding Bodies are separated horizontally.
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
         * The calculated angle of this Body's velocity vector, in degrees, during the last step.
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
         * Whether the Body's position and rotation are affected by its velocity, acceleration, drag, and gravity.
         *
         * @name Phaser.Physics.Arcade.Body#moves
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.moves = true;

        this.directControl = false;

        /**
         * Can this body be ridden like a platform?
         *
         * @name Phaser.Physics.Arcade.Body#rideable
         * @type {boolean}
         * @default false
         * @since 3.17.0
         */
        this.rideable = false;

        /**
         * Whether this Body is overlapped with another and both are not moving.
         *
         * @name Phaser.Physics.Arcade.Body#embedded
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.embedded = false;

        /**
         * An internal object holding the list of current frame blockers for this Body.
         *
         * @name Phaser.Physics.Arcade.Body#blockers
         * @type {Object}
         * @private
         * @default 0
         * @since 3.17.0
         */
        this.blockers = { up: [], down: [], left: [], right: [] };

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
         * Stores the Game Object's bounds.
         *
         * @name Phaser.Physics.Arcade.Body#_bounds
         * @type {Phaser.Geom.Rectangle}
         * @private
         * @since 3.0.0
         */
        this._bounds = new Rectangle();

        /**
         * The amount of gravity that was applied to the body in the current frame.
         *
         * @name Phaser.Physics.Arcade.Body#_gx
         * @type {number}
         * @private
         * @default 0
         * @since 3.17.0
         */
        this._gx = 0;

        /**
         * The amount of gravity that was applied to the body in the current frame.
         *
         * @name Phaser.Physics.Arcade.Body#_gy
         * @type {number}
         * @private
         * @default 0
         * @since 3.17.0
         */
        this._gy = 0;

        /**
         * The sleep check cached value.
         *
         * @name Phaser.Physics.Arcade.Body#_sleepX
         * @type {number}
         * @private
         * @default 0
         * @since 3.17.0
         */
        this._sleepX = 0;

        /**
         * The sleep check cached value.
         *
         * @name Phaser.Physics.Arcade.Body#_sleepY
         * @type {number}
         * @private
         * @default 0
         * @since 3.17.0
         */
        this._sleepY = 0;

        this.distanceThreshold = 8;

        this._cs = false;
        this._cx = this.x;
        this._cy = this.y;
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

        if (!sprite)
        {
            return;
        }

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
     * Prepares the Body for a physics step by resetting all the states and syncing the position
     * with the parent Game Object.
     * 
     * This method is only ever called once per game step.
     *
     * @method Phaser.Physics.Arcade.Body#preUpdate
     * @since 3.17.0
     */
    preUpdate: function ()
    {
        var touching = this.touching;
        var blocked = this.blocked;
        var worldBlocked = this.worldBlocked;
        var hardBlocked = this.hardBlocked;

        touching.none = true;
        touching.up = false;
        touching.down = false;
        touching.left = false;
        touching.right = false;

        blocked.none = true;
        blocked.up = false;
        blocked.down = false;
        blocked.left = false;
        blocked.right = false;

        worldBlocked.none = true;
        worldBlocked.left = false;
        worldBlocked.right = false;
        worldBlocked.up = false;
        worldBlocked.down = false;

        hardBlocked.none = true;
        hardBlocked.left = false;
        hardBlocked.right = false;
        hardBlocked.up = false;
        hardBlocked.down = false;

        this.snapTo = null;
        this.embedded = false;
        this.forcePosition = 0;

        //  Updates the transform values

        if (this.gameObject)
        {
            this.updateBounds();

            var parent = this.transform;
    
            this.x = parent.x + parent.scaleX * (this.offset.x - parent.displayOriginX);
            this.y = parent.y + parent.scaleY * (this.offset.y - parent.displayOriginY);

            this.prev.x = this.x;
            this.prev.y = this.y;
        }

        this.preRotation = this.rotation;

        if (this._cs)
        {
            if (DistanceBetween(this._cx, this._cy, this.x, this.y) > this.distanceThreshold)
            {
                this.setDirectPosition(this._cx, this._cy, 1);
            }
            
            this._cs = false;
        }

        if (this.collideWorldBounds)
        {
            this.checkWorldBounds();
        }

        this.updateCenter();

        this.prevVelocity.x = this.velocity.x;
        this.prevVelocity.y = this.velocity.y;
    },

    setDirectPosition: function (x, y, lerp)
    {
        if (lerp === undefined) { lerp = 1; }

        if (!this.directControl)
        {
            return this;
        }

        if ((x > this.x && this.isBlockedRight()) || (x < this.x && this.isBlockedLeft()))
        {
            x = this.x;
        }

        if ((y > this.y && this.isBlockedDown()) || (y < this.y && this.isBlockedUp()))
        {
            y = this.y;
        }

        if (this.calculateVelocity(x, y, lerp, this.maxSpeed))
        {
            this.wake();

            this._cs = true;
            this._cx = x;
            this._cy = y;
        }
        else
        {
            this._cs = false;
        }

        return this;
    },

    calculateVelocity: function (x, y, lerp, maxSpeed)
    {
        var maxX = this.maxVelocity.x;
        var maxY = this.maxVelocity.y;

        var velocity = this.velocity;

        var px = this.x;
        var py = this.y;

        if (x === this.x && y === this.y)
        {
            velocity.set(0);

            return true;
        }

        var angle = Math.atan2(y - py, x - px);

        var speed = DistanceBetween(px, py, x, y) / (this.world._frameTime * lerp);

        velocity.setToPolar(angle, speed);

        velocity.x = Clamp(velocity.x, -maxX, maxX);
        velocity.y = Clamp(velocity.y, -maxY, maxY);

        if (maxSpeed > -1 && velocity.length() > maxSpeed)
        {
            velocity.normalize().scale(maxSpeed);
        }

        return (velocity.x !== 0 || velocity.y !== 0);
    },

    /**
     * Performs a single physics step and updates the body velocity, angle, speed and other
     * properties.
     * 
     * This method can be called multiple times per game step.
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
        this.checkBlockers();

        var velocity = this.velocity;
        var position = this.position;

        if (this.moves)
        {
            this.world.updateMotion(this, delta);

            //  Has it been woken up?

            if (this.sleeping && !this.checkWake())
            {
                return;
            }

            if (this.collideWorldBounds)
            {
                this.checkWorldRebound();
            }

            if (this.forcePosition < 5)
            {
                this.moveX(velocity.x * delta);
                this.moveY(velocity.y * delta);
            }
        }

        //  Calculate the delta
        this._dx = position.x - this.prev.x;
        this._dy = position.y - this.prev.y;

        this.updateCenter();

        var vx = velocity.x;
        var vy = velocity.y;

        this.angle = Math.atan2(vy, vx);
        this.speed = Math.sqrt(vx * vx + vy * vy);

        //  Now the update will throw collision checks at the Body
        //  And finally we'll integrate the new position back to the Sprite in postUpdate
    },

    /**
     * Feeds the Body results back into the parent Game Object.
     * 
     * This method is only ever called once per game step.
     *
     * @method Phaser.Physics.Arcade.Body#postUpdate
     * @since 3.0.0
     */
    postUpdate: function ()
    {
        var dx = this.position.x - this.prev.x;
        var dy = this.position.y - this.prev.y;
        var dz = this.deltaZ();

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

        var gameObject = this.gameObject;

        if (this.moves)
        {
            if (this.forcePosition > 0)
            {
                var snapX = this.x;
                var snapY = this.y;

                switch (this.forcePosition)
                {
                    case 1:
                        snapY = this.snapTo.bottom;
                        break;

                    case 2:
                        snapY = this.snapTo.y - this.height;
                        break;

                    case 3:
                        snapX = this.snapTo.right;
                        break;

                    case 4:
                        snapX = this.snapTo.x - this.width;
                        break;
                }

                if (gameObject)
                {
                    gameObject.x += (snapX - this.prev.x);
                    gameObject.y += (snapY - this.prev.y);
                }

                dx = 0;
                dy = 0;
            }
            else if (!this.sleeping && gameObject)
            {
                gameObject.x += dx;
                gameObject.y += dy;

                if (this.allowRotation)
                {
                    gameObject.angle += dz;
                }
            }
        }

        this._dx = dx;
        this._dy = dy;

        this.checkSleep(dx, dy, dz);

        this._sleepX = this.x;
        this._sleepY = this.y;

        if (this.directControl)
        {
            this.velocity.set(0);
        }

        //  Store collision flags
        var wasTouching = this.wasTouching;
        var touching = this.touching;

        wasTouching.none = touching.none;
        wasTouching.up = touching.up;
        wasTouching.down = touching.down;
        wasTouching.left = touching.left;
        wasTouching.right = touching.right;
    },

    sleep: function (forceY)
    {
        if (!this.sleeping && this.canSleep)
        {
            this._cs = false;
            this.sleeping = true;

            // console.log(this.gameObject.name, 'put to sleep on frame', this.world._frame, 'force?', forceY, 'at', this.x);
    
            this.velocity.set(0);
            this.prevVelocity.set(0);
            this.speed = 0;

            if (forceY)
            {
                // this.snapToBlocker();
            }
        }
    },

    snapToBlocker: function ()
    {
        if (!this.velocity.equals(0))
        {
            return;
        }

        var blocked = this.blocked;
        var worldBlocked = this.worldBlocked;

        if (!worldBlocked.none)
        {
            // console.log(this.gameObject.name, 'snapped to world bounds');

            var worldBounds = this.world.bounds;

            if (worldBlocked.up)
            {
                this.y = worldBounds.y;
            }
            else if (worldBlocked.down)
            {
                this.bottom = worldBounds.bottom;
            }

            if (worldBlocked.left)
            {
                this.x = worldBounds.x;
            }
            else if (worldBlocked.right)
            {
                this.right = worldBounds.right;
            }

            this.forcePosition = 5;
        }
        else if (!blocked.none)
        {
            // console.log(this.gameObject.name, 'snapped to blocker bounds scanning ...');

            var body2;

            if (blocked.up)
            {
                body2 = this.getBlocker(this.blockers.up);

                if (body2)
                {
                    // console.log('blocker bounds found', body2.y);

                    this.y = body2.bottom;

                    this.forcePosition = 5;
                }
            }
            else if (blocked.down)
            {
                body2 = this.getBlocker(this.blockers.down);

                if (body2)
                {
                    // console.log('blocker bounds found', body2.y);

                    this.bottom = body2.y;

                    this.forcePosition = 5;
                }
            }
            else if (blocked.left)
            {
                body2 = this.getBlocker(this.blockers.left);

                if (body2)
                {
                    // console.log('blocker bounds found', body2.y);

                    this.x = body2.right;

                    this.forcePosition = 5;
                }
            }
            else if (blocked.right)
            {
                body2 = this.getBlocker(this.blockers.right);

                if (body2)
                {
                    // console.log('blocker bounds found', body2.y);

                    this.right = body2.x;

                    this.forcePosition = 5;
                }
            }
        }
    },

    getBlocker: function (blockers)
    {
        for (var i = 0; i < blockers.length; i++)
        {
            var collisionInfo = blockers[i];

            // console.log('CI', collisionInfo.body1.gameObject.name, collisionInfo.body2.gameObject.name);

            if (collisionInfo.body1 === this)
            {
                return collisionInfo.body2;
            }
            else if (collisionInfo.body2 === this)
            {
                return collisionInfo.body1;
            }
        }

        return null;
    },

    checkWake: function ()
    {
        if (!this.sleeping)
        {
            return false;
        }

        var velocity = this.velocity;

        if ((velocity.x < 0 && !this.isBlockedLeft()) || (velocity.y > 0 && !this.isBlockedRight()) || (velocity.y < 0 && !this.isBlockedUp()) || (velocity.y > 0 && !this.isBlockedDown()))
        {
            // console.log('%c' + this.gameObject.name + ' has woken                                 ', 'background-color: lime');

            this.sleeping = false;
            this._sleep = 0;

            return true;
        }

        return false;
    },

    wake: function ()
    {
        if (this.sleeping)
        {
            // console.log('%c' + this.gameObject.name + ' has woken                                  ', 'background-color: lime');

            this.sleeping = false;
            this._sleep = 0;
        }
    },

    checkBlockers: function ()
    {
        //  Iterate through the list of previous frame blockers and see if they are still there

        for (var face in this.blockers)
        {
            var currentBlockers = [];
            var prevBlockers = this.blockers[face];

            for (var i = 0; i < prevBlockers.length; i++)
            {
                var data = prevBlockers[i];
    
                if (CheckOverlap(data))
                {
                    currentBlockers.push(data);
                }
            }
    
            this.blockers[face] = currentBlockers;
        }
    },

    //  Return true if body can be repositioned after this call, otherwise return false to stop positioning in the update
    checkWorldRebound: function ()
    {
        var blocked = this.blocked;
        var velocity = this.velocity;
        var worldBlocked = this.worldBlocked;
        var worldCollision = this.world.checkCollision;

        var bx = (this.worldBounce) ? this.worldBounce.x : this.bounce.x;
        var by = (this.worldBounce) ? this.worldBounce.y : this.bounce.y;

        if (worldBlocked.none || velocity.equals(0) || (bx === 0 && by === 0))
        {
            //  Nothing to do
            return;
        }

        var testX = (bx !== 0) && ((worldCollision.right && worldBlocked.right && !blocked.left && velocity.x > 0) || (worldCollision.left && worldBlocked.left && !blocked.right && velocity.x < 0));
        var testY = (by !== 0) && ((worldCollision.down && worldBlocked.down && !blocked.up && velocity.y > 0) || (worldCollision.up && worldBlocked.up && !blocked.down && velocity.y < 0));

        if (this.sleeping || (!testX && !testY))
        {
            return;
        }

        var sleepX = false;
        var sleepY = false;
        var emitBoundsEvent = false;

        if (testX)
        {
            var gravityX = this._gx;
            var newVelocityX = velocity.x * bx;

            if (gravityX > 0)
            {
                //  Gravity is pulling them down
                if (newVelocityX > 0 && (newVelocityX < gravityX || FuzzyLessThan(newVelocityX, gravityX, this.minVelocity.x)))
                {
                    sleepX = true;
                }
                else
                {
                    velocity.x *= -bx;

                    emitBoundsEvent = true;
                }
            }
            else if (gravityX < 0)
            {
                //  Gravity is pulling them up
                if (newVelocityX < 0 && (newVelocityX > gravityX || FuzzyGreaterThan(newVelocityX, gravityX, this.minVelocity.x)))
                {
                    sleepX = true;
                }
                else
                {
                    velocity.x *= -bx;

                    emitBoundsEvent = true;
                }
            }
            else if (gravityX === 0)
            {
                if (FuzzyEqual(newVelocityX, 0, this.minVelocity.x))
                {
                    //  Gravity is zero, so rebound must have been from velocity alone
                    sleepX = true;
                }
                else
                {
                    velocity.x *= -bx;
    
                    emitBoundsEvent = true;
                }
            }
        }
        else
        {
            sleepX = true;
        }

        //  Reverse the velocity for the world bounce?
        if (testY)
        {
            var gravityY = this._gy;
            var newVelocityY = velocity.y * by;

            if (gravityY > 0)
            {
                //  Gravity is pulling them down
                if (newVelocityY > 0 && (newVelocityY < gravityY || FuzzyLessThan(newVelocityY, gravityY, this.minVelocity.y)))
                {
                    sleepY = true;
                }
                else
                {
                    velocity.y *= -by;

                    emitBoundsEvent = true;
                }
            }
            else if (gravityY < 0)
            {
                //  Gravity is pulling them up
                if (newVelocityY < 0 && (newVelocityY > gravityY || FuzzyGreaterThan(newVelocityY, gravityY, this.minVelocity.y)))
                {
                    sleepY = true;
                }
                else
                {
                    velocity.y *= -by;

                    emitBoundsEvent = true;
                }
            }
            else if (gravityY === 0)
            {
                if (FuzzyEqual(newVelocityY, 0, this.minVelocity.y))
                {
                    //  Gravity is zero, so rebound must have been from velocity alone
                    sleepY = true;
                }
                else
                {
                    velocity.y *= -by;
    
                    emitBoundsEvent = true;
                }
            }
        }
        else
        {
            sleepY = true;
        }

        if (sleepX && sleepY)
        {
            this.sleep(true);
        }
        else if (emitBoundsEvent && this.onWorldBounds)
        {
            this.world.emit(Events.WORLD_BOUNDS, this, worldBlocked.up, worldBlocked.down, worldBlocked.left, worldBlocked.right);
        }
    },

    //  return true if gravity is pulling up and body blocked up,
    //  or gravity is pulling down and body blocked down
    isGravityBlockedX: function ()
    {
        var gx = this._gx;

        return (gx === 0 || (gx < 0 && this.isBlockedLeft()) || (gx > 0 && this.isBlockedRight()));
    },

    //  return true if gravity is pulling up and body blocked up,
    //  or gravity is pulling down and body blocked down
    isGravityBlockedY: function ()
    {
        var gy = this._gy;

        return (gy === 0 || (gy < 0 && this.isBlockedUp()) || (gy > 0 && this.isBlockedDown()));
    },

    //  Check for sleeping state
    checkSleep: function (dx, dy, dz)
    {
        if (!this.moves || !this.canSleep)
        {
            return;
        }

        //  Can't sleep if not blocked in the opposite direction somehow

        dx = Math.abs(dx);
        dy = Math.abs(dy);
        dz = Math.abs(dz);

        if (!this.sleeping && (dx < 1 && dy < 1 && dz < 1) && this.isGravityBlockedX() && this.isGravityBlockedY())
        {
            //  Falling asleep?
            var lowX = FuzzyEqual(this.x, this._sleepX, 0.01);
            var lowY = FuzzyEqual(this.y, this._sleepY, 0.01);
            var rotating = (this.angularAcceleration !== 0 || this.angularVelocity !== 0);

            if (lowX && lowY && !rotating)
            {
                if (this._sleep < this.sleepIterations)
                {
                    this._sleep++;
    
                    if (this._sleep >= this.sleepIterations)
                    {
                        this.sleep(true);
                    }
                }
            }
            else
            {
                this._sleep = 0;
            }
        }
        else if (this.sleeping && (!this.velocity.equals(this.prevVelocity) || this.angularAcceleration !== 0 || this.angularVelocity !== 0))
        {
            this.wake();
        }
        else if (this.sleeping && (!this.isGravityBlockedX() || !this.isGravityBlockedY()))
        {
            //  Waking up?
            if (this._sleep > 0)
            {
                //  Do it progressively, not instantly, to ensure it isn't just a step fluctuation
                this._sleep -= (this.sleepIterations * 0.1);
    
                if (this._sleep <= 0)
                {
                    this.wake();
                }
            }
        }
    },

    /**
     * Checks for collisions between this Body and the world boundary and separates them.
     *
     * @method Phaser.Physics.Arcade.Body#checkWorldBounds
     * @since 3.0.0
     *
     * @return {boolean} True if this Body is touching over intersecting with the world boundary.
     */
    checkWorldBounds: function ()
    {
        var velocity = this.velocity;
        var worldBounds = this.world.bounds;
        var worldCollision = this.world.checkCollision;

        if (worldCollision.up && this.y <= (worldBounds.y + 1) && velocity.y <= 0)
        {
            this.setWorldBlockedUp(true);
        }
        else if (worldCollision.down && this.bottom >= (worldBounds.bottom - 1) && velocity.y >= 0)
        {
            this.setWorldBlockedDown(true);
        }

        if (worldCollision.left && this.x <= (worldBounds.x + 1) && velocity.x <= 0)
        {
            this.setWorldBlockedLeft(true);
        }
        else if (worldCollision.right && this.right >= (worldBounds.right - 1) && velocity.x >= 0)
        {
            this.setWorldBlockedRight(true);
        }
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

        this.sourceWidth = width;
        this.sourceHeight = height;

        this.width = this.sourceWidth * this._sx;
        this.height = this.sourceHeight * this._sy;

        this.halfWidth = Math.floor(this.width / 2);
        this.halfHeight = Math.floor(this.height / 2);

        this.updateCenter();

        if (center && gameObject && gameObject.getCenter)
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

        if (gameObject)
        {
            gameObject.setPosition(x, y);

            gameObject.getTopLeft(this.position);

            this.rotation = gameObject.angle;
            this.preRotation = gameObject.angle;
        }

        this.position.set(x, y);
        this.prev.set(x, y);

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
        return Math.abs(this._dx);
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
        return Math.abs(this._dy);
    },

    /**
     * The change in this Body's horizontal position from the previous step.
     * This value is set during the Body's update phase.
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
     * Sets whether this Body collides with the world boundary.
     * 
     * Optionally also sets the World Bounce values. If the `Body.worldBounce` is null, it's set to a new Vec2 first.
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

        if (this.speed > 0)
        {
            this.wake();
        }

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
        return this.setVelocity(value, this.velocity.y);
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
        return this.setVelocity(this.velocity.x, value);
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
        return this.setBounce(value, this.bounce.y);
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
        return this.setBounce(this.bounce.x, value);
    },

    setRiding: function (body2, face)
    {
        this.snapTo = body2;
        this.forcePosition = 10;

        if (face === CONST.FACING_UP)
        {
            this.y = body2.bottom;
        }
        else if (face === CONST.FACING_DOWN)
        {
            this.bottom = body2.y;
        }

        return this;
    },

    setBlockedUp: function (collisionInfo, body2)
    {
        var blocked = this.blocked;

        blocked.up = true;
        blocked.none = false;

        if (collisionInfo)
        {
            if (!body2)
            {
                ArrayAdd(this.blockers.up, collisionInfo);
            }
            else if (body2.rideable)
            {
                return this.setRiding(body2, CONST.FACING_UP);
            }
            else if (body2.isWorldBlockedUp())
            {
                this.setHardBlockedUp();

                this.forcePosition = 6;

                this.y = body2.bottom;
            }

            //  We don't reposition this body if it's already blocked on a face
            if (this.forcePosition === 5 || this.isWorldBlockedUp() || this.isWorldBlockedDown())
            {
                return this;
            }

            if (body2 && !this.immovable && !collisionInfo.set && !this.snapTo)
            {
                // console.log(this.gameObject.name, 'setBlockedUp', body2.bottom);

                this.snapTo = body2;

                this.y = body2.bottom;

                this.forcePosition = 1;

                collisionInfo.set = true;
            }

            if (this.directControl)
            {
                this._cy = this.y;
                this._cs = true;
            }
        }

        return this;
    },

    setBlockedDown: function (collisionInfo, body2)
    {
        var blocked = this.blocked;

        blocked.down = true;
        blocked.none = false;

        if (collisionInfo)
        {
            if (!body2)
            {
                ArrayAdd(this.blockers.down, collisionInfo);
            }
            else if (body2.rideable)
            {
                return this.setRiding(body2, CONST.FACING_DOWN);
            }
            else if (body2.isWorldBlockedDown())
            {
                this.setHardBlockedDown();

                this.forcePosition = 7;

                this.bottom = body2.y;
            }

            //  We don't reposition this body if it's already blocked on a face
            if (this.forcePosition === 5 || this.isWorldBlockedUp() || this.isWorldBlockedDown())
            {
                return this;
            }

            if (body2 && !this.immovable && !collisionInfo.set && !this.snapTo)
            {
                // console.log(this.gameObject.name, 'setBlockedDown', body2.y);

                this.snapTo = body2;

                this.bottom = body2.y;

                this.forcePosition = 2;

                collisionInfo.set = true;
            }

            if (this.directControl)
            {
                this._cy = this.y;
                this._cs = true;
            }
        }

        return this;
    },

    setBlockedLeft: function (collisionInfo, body2)
    {
        var blocked = this.blocked;

        blocked.left = true;
        blocked.none = false;

        if (collisionInfo)
        {
            if (!body2)
            {
                ArrayAdd(this.blockers.left, collisionInfo);
            }
            else if (body2.rideable)
            {
                return this.setRiding(body2, CONST.FACING_LEFT);
            }
            else if (body2.isWorldBlockedLeft())
            {
                this.setHardBlockedLeft();

                this.forcePosition = 8;

                this.x = body2.right;
            }

            //  We don't reposition this body if it's already blocked on a face
            if (this.forcePosition === 5 || this.isWorldBlockedLeft() || this.isWorldBlockedRight())
            {
                return this;
            }

            if (body2 && !this.immovable && !collisionInfo.set && !this.snapTo)
            {
                // console.log(this.gameObject.name, 'setBlockedUp', body2.bottom);

                this.snapTo = body2;

                this.x = body2.right;

                this.forcePosition = 3;

                collisionInfo.set = true;
            }

            if (this.directControl)
            {
                this._cx = this.x;
                this._cs = true;
            }
        }

        return this;
    },

    setBlockedRight: function (collisionInfo, body2)
    {
        var blocked = this.blocked;

        blocked.right = true;
        blocked.none = false;

        if (collisionInfo)
        {
            if (!body2)
            {
                ArrayAdd(this.blockers.right, collisionInfo);
            }
            else if (body2.rideable)
            {
                return this.setRiding(body2, CONST.FACING_RIGHT);
            }
            else if (body2.isWorldBlockedRight())
            {
                this.setHardBlockedRight();

                this.forcePosition = 9;

                this.right = body2.x;
            }

            //  We don't reposition this body if it's already blocked on a face
            if (this.forcePosition === 5 || this.isWorldBlockedLeft() || this.isWorldBlockedRight())
            {
                return this;
            }

            if (body2 && !this.immovable && !collisionInfo.set && !this.snapTo)
            {
                // console.log(this.gameObject.name, 'setBlockedDown', body2.y);

                this.snapTo = body2;

                this.right = body2.x;

                this.forcePosition = 4;

                collisionInfo.set = true;
            }

            if (this.directControl)
            {
                this._cx = this.x;
                this._cs = true;
            }
        }

        return this;
    },

    moveX: function (amount)
    {
        var diff = amount;
        var bounds = this.world.bounds;

        if (this.collideWorldBounds)
        {
            var worldCollision = this.world.checkCollision;

            if (amount < 0 && worldCollision.left && this.x + amount < bounds.x)
            {
                diff = amount - ((this.x + amount) - bounds.x);

                if (diff !== 0)
                {
                    this.wake();
                }
            
                this.setWorldBlockedLeft(true);

                this.x += diff;

                return diff;
            }
            else if (amount > 0 && worldCollision.right && this.right + amount > bounds.right)
            {
                diff = amount - ((this.right + amount) - bounds.right);

                if (diff !== 0)
                {
                    this.wake();
                }
            
                this.setWorldBlockedRight(true);

                this.x += diff;

                return diff;
            }
        }

        if (amount < 0 && this.isBlockedLeft())
        {
            bounds = this.getBlocker(this.blockers.left);

            if (bounds && this.x + amount < bounds.x)
            {
                diff = amount - ((this.x + amount) - bounds.x);
            }
        }
        else if (amount > 0 && this.isBlockedRight())
        {
            bounds = this.getBlocker(this.blockers.right);

            if (bounds && this.right + amount > bounds.right)
            {
                diff = amount - ((this.right + amount) - bounds.right);
            }
        }

        if (diff !== 0)
        {
            this.wake();

            this.x += diff;
        }
    },

    moveY: function (amount)
    {
        var diff = amount;
        var bounds = this.world.bounds;

        if (this.collideWorldBounds)
        {
            var worldCollision = this.world.checkCollision;

            if (amount < 0 && worldCollision.up && this.y + amount < bounds.y)
            {
                diff = amount - ((this.y + amount) - bounds.y);

                if (diff !== 0)
                {
                    this.wake();
                }
            
                this.setWorldBlockedUp(true);

                this.y += diff;

                return diff;
            }
            else if (amount > 0 && worldCollision.down && this.bottom + amount > bounds.bottom)
            {
                diff = amount - ((this.bottom + amount) - bounds.bottom);

                if (diff !== 0)
                {
                    this.wake();
                }
            
                this.setWorldBlockedDown(true);

                this.y += diff;

                return diff;
            }
        }

        if (amount < 0 && this.isBlockedUp())
        {
            bounds = this.getBlocker(this.blockers.up);

            if (bounds && this.y + amount < bounds.y)
            {
                diff = amount - ((this.y + amount) - bounds.y);
            }
        }
        else if (amount > 0 && this.isBlockedDown())
        {
            bounds = this.getBlocker(this.blockers.down);

            if (bounds && this.bottom + amount > bounds.bottom)
            {
                diff = amount - ((this.bottom + amount) - bounds.bottom);
            }
        }

        if (diff !== 0)
        {
            this.wake();

            this.y += diff;
        }

        return diff;
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
        return this.setAcceleration(value, this.acceleration.y);
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
        return this.setAcceleration(this.acceleration.x, value);
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
        return this.setDrag(value, this.drag.y);
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
        return this.setDrag(this.drag.x, value);
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
        return this.setGravity(value, this.gravity.y);
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
        return this.setGravity(this.gravity.x, value);
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
        this.setFriction(value, this.friction.y);
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
        this.setFriction(this.friction.x, value);
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

        if (value !== 0)
        {
            this.wake();
        }

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

        if (value !== 0)
        {
            this.wake();
        }

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

    setDirectControl: function (value)
    {
        if (value === undefined) { value = true; }

        if (value)
        {
            this.directControl = true;
            // this.canSleep = false;
            this.maxSpeed = 2000;
        }
        else
        {
            this.directControl = false;
            // this.canSleep = true;
        }

        return this;
    },

    setMovingPlatform: function ()
    {
        this.immovable = true;
        this.rideable = true;
        this.moves = false;

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
        },

        set: function (value)
        {
            this.position.x = value;
        }

    },

    /**
     * The right edge of the Body's boundary.
     *
     * @name Phaser.Physics.Arcade.Body#right
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
            this.position.x = value - this.width;
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
        },

        set: function (value)
        {
            this.position.y = value;
        }

    },

    /**
     * The bottom edge of this Body's boundary.
     *
     * @name Phaser.Physics.Arcade.Body#bottom
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
            this.position.y = value - this.height;
        }

    },

    /**
     * The horizontal position of the Body when under direct control.
     * Setting this causes the current velocity to change.
     *
     * @name Phaser.Physics.Arcade.Body#directX
     * @type {number}
     * @since 3.17.0
     */
    directX: {

        get: function ()
        {
            return this._cx;
        },

        set: function (value)
        {
            this.setDirectPosition(value, this._cy);
        }

    },

    /**
     * The vertical position of the Body when under direct control.
     * Setting this causes the current velocity to change.
     *
     * @name Phaser.Physics.Arcade.Body#directY
     * @type {number}
     * @since 3.17.0
     */
    directY: {

        get: function ()
        {
            return this._cy;
        },

        set: function (value)
        {
            this.setDirectPosition(this._cx, value);
        }

    }

});

module.exports = Body;
