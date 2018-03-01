/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CircleContains = require('../../geom/circle/Contains');
var Class = require('../../utils/Class');
var CONST = require('./const');
var Rectangle = require('../../geom/rectangle/Rectangle');
var RectangleContains = require('../../geom/rectangle/Contains');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * [description]
 *
 * @class Body
 * @memberOf Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.World} world - [description]
 * @param {Phaser.GameObjects.GameObject} gameObject - [description]
 */
var Body = new Class({

    initialize:

    function Body (world, gameObject)
    {
        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#world
         * @type {Phaser.Physics.Arcade.World}
         * @since 3.0.0
         */
        this.world = world;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#gameObject
         * @type {Phaser.GameObjects.GameObject}
         * @since 3.0.0
         */
        this.gameObject = gameObject;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#debugShowBody
         * @type {boolean}
         * @since 3.0.0
         */
        this.debugShowBody = world.defaults.debugShowBody;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#debugShowVelocity
         * @type {boolean}
         * @since 3.0.0
         */
        this.debugShowVelocity = world.defaults.debugShowVelocity;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#debugBodyColor
         * @type {integer}
         * @since 3.0.0
         */
        this.debugBodyColor = world.defaults.bodyDebugColor;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#enable
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.enable = true;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#isCircle
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.isCircle = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#radius
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.radius = 0;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#offset
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.offset = new Vector2();

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#position
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.position = new Vector2(gameObject.x, gameObject.y);

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#prev
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.prev = new Vector2(this.position.x, this.position.y);

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#allowRotation
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.allowRotation = true;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#rotation
         * @type {number}
         * @since 3.0.0
         */
        this.rotation = gameObject.angle;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#preRotation
         * @type {number}
         * @since 3.0.0
         */
        this.preRotation = gameObject.angle;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#width
         * @type {number}
         * @since 3.0.0
         */
        this.width = gameObject.width;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#height
         * @type {number}
         * @since 3.0.0
         */
        this.height = gameObject.height;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#sourceWidth
         * @type {number}
         * @since 3.0.0
         */
        this.sourceWidth = gameObject.width;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#sourceHeight
         * @type {number}
         * @since 3.0.0
         */
        this.sourceHeight = gameObject.height;

        if (gameObject.frame)
        {
            this.sourceWidth = gameObject.frame.realWidth;
            this.sourceHeight = gameObject.frame.realHeight;
        }

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#halfWidth
         * @type {number}
         * @since 3.0.0
         */
        this.halfWidth = Math.abs(gameObject.width / 2);

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#halfHeight
         * @type {number}
         * @since 3.0.0
         */
        this.halfHeight = Math.abs(gameObject.height / 2);

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#center
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.center = new Vector2(gameObject.x + this.halfWidth, gameObject.y + this.halfHeight);

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#velocity
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.velocity = new Vector2();

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#newVelocity
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.newVelocity = new Vector2();

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#deltaMax
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.deltaMax = new Vector2();

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#acceleration
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.acceleration = new Vector2();

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#allowDrag
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.allowDrag = true;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#drag
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.drag = new Vector2();

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#allowGravity
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.allowGravity = true;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#gravity
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.gravity = new Vector2();

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#bounce
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.bounce = new Vector2();

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#worldBounce
         * @type {?[type]}
         * @default null
         * @since 3.0.0
         */
        this.worldBounce = null;

        //  If true this Body will dispatch events

        /**
         * Emit a `worldbounds` event when this body collides with the world bounds (and `collideWorldBounds` is also true).
         *
         * @name Phaser.Physics.Arcade.Body#onWorldBounds
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.onWorldBounds = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#onCollide
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.onCollide = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#onOverlap
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.onOverlap = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#maxVelocity
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.maxVelocity = new Vector2(10000, 10000);

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#friction
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.friction = new Vector2(1, 0);

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#angularVelocity
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.angularVelocity = 0;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#angularAcceleration
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.angularAcceleration = 0;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#angularDrag
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.angularDrag = 0;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#maxAngular
         * @type {number}
         * @default 1000
         * @since 3.0.0
         */
        this.maxAngular = 1000;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#mass
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.mass = 1;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#angle
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.angle = 0;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#speed
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.speed = 0;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#facing
         * @type {integer}
         * @since 3.0.0
         */
        this.facing = CONST.FACING_NONE;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#immovable
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.immovable = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#moves
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.moves = true;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#customSeparateX
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.customSeparateX = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#customSeparateY
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.customSeparateY = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#overlapX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.overlapX = 0;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#overlapY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.overlapY = 0;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#overlapR
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.overlapR = 0;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#embedded
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.embedded = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#collideWorldBounds
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.collideWorldBounds = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#checkCollision
         * @type {object}
         * @since 3.0.0
         */
        this.checkCollision = { none: false, up: true, down: true, left: true, right: true };

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#touching
         * @type {object}
         * @since 3.0.0
         */
        this.touching = { none: true, up: false, down: false, left: false, right: false };

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#wasTouching
         * @type {object}
         * @since 3.0.0
         */
        this.wasTouching = { none: true, up: false, down: false, left: false, right: false };

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#blocked
         * @type {object}
         * @since 3.0.0
         */
        this.blocked = { none: true, up: false, down: false, left: false, right: false };

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#dirty
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.dirty = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#syncBounds
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.syncBounds = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#isMoving
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.isMoving = false;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#stopVelocityOnCollide
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.stopVelocityOnCollide = true;

        //  read-only

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#physicsType
         * @type {integer}
         * @readOnly
         * @since 3.0.0
         */
        this.physicsType = CONST.DYNAMIC_BODY;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#_reset
         * @type {boolean}
         * @private
         * @default true
         * @since 3.0.0
         */
        this._reset = true;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#_sx
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._sx = gameObject.scaleX;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#_sy
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._sy = gameObject.scaleY;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#_dx
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._dx = 0;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#_dy
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._dy = 0;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Body#_bounds
         * @type {Phaser.Geom.Rectangle}
         * @private
         * @since 3.0.0
         */
        this._bounds = new Rectangle();
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#updateBounds
     * @since 3.0.0
     */
    updateBounds: function ()
    {
        var sprite = this.gameObject;

        if (this.syncBounds)
        {
            var b = sprite.getBounds(this._bounds);

            if (b.width !== this.width || b.height !== this.height)
            {
                this.width = b.width;
                this.height = b.height;
                this._reset = true;
            }
        }
        else
        {
            var asx = Math.abs(sprite.scaleX);
            var asy = Math.abs(sprite.scaleY);

            if (asx !== this._sx || asy !== this._sy)
            {
                this.width = this.sourceWidth * asx;
                this.height = this.sourceHeight * asy;
                this._sx = asx;
                this._sy = asy;
                this._reset = true;
            }
        }

        if (this._reset)
        {
            this.halfWidth = Math.floor(this.width / 2);
            this.halfHeight = Math.floor(this.height / 2);
            this.updateCenter();
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#updateCenter
     * @since 3.0.0
     */
    updateCenter: function ()
    {
        this.center.set(this.position.x + this.halfWidth, this.position.y + this.halfHeight);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#update
     * @since 3.0.0
     *
     * @param {number} delta - [description]
     */
    update: function (delta)
    {
        this.dirty = true;

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

        this.updateBounds();

        var sprite = this.gameObject;

        this.position.x = sprite.x + sprite.scaleX * (this.offset.x - sprite.displayOriginX);
        this.position.y = sprite.y + sprite.scaleY * (this.offset.y - sprite.displayOriginY);

        this.updateCenter();

        this.rotation = sprite.angle;

        this.preRotation = this.rotation;

        if (this._reset)
        {
            this.prev.x = this.position.x;
            this.prev.y = this.position.y;
        }

        if (this.moves)
        {
            this.world.updateMotion(this);

            this.newVelocity.set(this.velocity.x * delta, this.velocity.y * delta);

            this.position.x += this.newVelocity.x;
            this.position.y += this.newVelocity.y;

            this.updateCenter();

            if (this.position.x !== this.prev.x || this.position.y !== this.prev.y)
            {
                this.angle = Math.atan2(this.velocity.y, this.velocity.x);
            }

            this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

            //  Now the State update will throw collision checks at the Body
            //  And finally we'll integrate the new position back to the Sprite in postUpdate

            if (this.collideWorldBounds && this.checkWorldBounds() && this.onWorldBounds)
            {
                this.world.emit('worldbounds', this, this.blocked.up, this.blocked.down, this.blocked.left, this.blocked.right);
            }
        }

        this._dx = this.deltaX();
        this._dy = this.deltaY();

        this._reset = false;
    },

    /**
     * Feeds the body results back into the parent gameobject.
     *
     * @method Phaser.Physics.Arcade.Body#postUpdate
     * @since 3.0.0
     */
    postUpdate: function ()
    {
        //  Only allow postUpdate to be called once per frame
        if (!this.enable || !this.dirty)
        {
            return;
        }

        this.dirty = false;

        this._dx = this.deltaX();
        this._dy = this.deltaY();

        if (this._dx < 0)
        {
            this.facing = CONST.FACING_LEFT;
        }
        else if (this._dx > 0)
        {
            this.facing = CONST.FACING_RIGHT;
        }

        if (this._dy < 0)
        {
            this.facing = CONST.FACING_UP;
        }
        else if (this._dy > 0)
        {
            this.facing = CONST.FACING_DOWN;
        }

        if (this.moves)
        {
            if (this.deltaMax.x !== 0 && this._dx !== 0)
            {
                if (this._dx < 0 && this._dx < -this.deltaMax.x)
                {
                    this._dx = -this.deltaMax.x;
                }
                else if (this._dx > 0 && this._dx > this.deltaMax.x)
                {
                    this._dx = this.deltaMax.x;
                }
            }

            if (this.deltaMax.y !== 0 && this._dy !== 0)
            {
                if (this._dy < 0 && this._dy < -this.deltaMax.y)
                {
                    this._dy = -this.deltaMax.y;
                }
                else if (this._dy > 0 && this._dy > this.deltaMax.y)
                {
                    this._dy = this.deltaMax.y;
                }
            }

            this.gameObject.x += this._dx;
            this.gameObject.y += this._dy;

            this._reset = true;
        }

        this.updateCenter();

        if (this.allowRotation)
        {
            this.gameObject.angle += this.deltaZ();
        }

        this.prev.x = this.position.x;
        this.prev.y = this.position.y;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#checkWorldBounds
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    checkWorldBounds: function ()
    {
        var pos = this.position;
        var bounds = this.world.bounds;
        var check = this.world.checkCollision;

        var bx = (this.worldBounce) ? -this.worldBounce.x : -this.bounce.x;
        var by = (this.worldBounce) ? -this.worldBounce.y : -this.bounce.y;

        if (pos.x < bounds.x && check.left)
        {
            pos.x = bounds.x;
            this.velocity.x *= bx;
            this.blocked.left = true;
            this.blocked.none = false;
        }
        else if (this.right > bounds.right && check.right)
        {
            pos.x = bounds.right - this.width;
            this.velocity.x *= bx;
            this.blocked.right = true;
            this.blocked.none = false;
        }

        if (pos.y < bounds.y && check.up)
        {
            pos.y = bounds.y;
            this.velocity.y *= by;
            this.blocked.up = true;
            this.blocked.none = false;
        }
        else if (this.bottom > bounds.bottom && check.down)
        {
            pos.y = bounds.bottom - this.height;
            this.velocity.y *= by;
            this.blocked.down = true;
            this.blocked.none = false;
        }

        return !this.blocked.none;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setOffset
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setSize
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {boolean} [center=true] - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setSize: function (width, height, center)
    {
        if (center === undefined) { center = true; }

        var gameObject = this.gameObject;

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
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setCircle
     * @since 3.0.0
     *
     * @param {number} radius - [description]
     * @param {number} [offsetX] - [description]
     * @param {number} [offsetY] - [description]
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
     * If the body had any velocity or acceleration it is lost as a result of calling this.
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

        gameObject.getTopLeft(this.position);

        this.prev.copy(this.position);

        this.rotation = gameObject.angle;
        this.preRotation = gameObject.angle;

        this.updateBounds();
        this.updateCenter();
    },

    /**
     * [description]
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#getBounds
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
     * @method Phaser.Physics.Arcade.Body#hitTest
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
     * @method Phaser.Physics.Arcade.Body#onFloor
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    onFloor: function ()
    {
        return this.blocked.down;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#onCeiling
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    onCeiling: function ()
    {
        return this.blocked.up;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#onWall
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    onWall: function ()
    {
        return (this.blocked.left || this.blocked.right);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#deltaAbsX
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    deltaAbsX: function ()
    {
        return (this.deltaX() > 0) ? this.deltaX() : -this.deltaX();
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#deltaAbsY
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    deltaAbsY: function ()
    {
        return (this.deltaY() > 0) ? this.deltaY() : -this.deltaY();
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#deltaX
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    deltaX: function ()
    {
        return this.position.x - this.prev.x;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#deltaY
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    deltaY: function ()
    {
        return this.position.y - this.prev.y;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#deltaZ
     * @since 3.0.0
     *
     * @return {number} [description]
     */
    deltaZ: function ()
    {
        return this.rotation - this.preRotation;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#destroy
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
     * @method Phaser.Physics.Arcade.Body#drawDebug
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Graphics} graphic - [description]
     */
    drawDebug: function (graphic)
    {
        var pos = this.position;
        var x = pos.x + this.halfWidth;
        var y = pos.y + this.halfHeight;

        if (this.debugShowBody)
        {
            graphic.lineStyle(1, this.debugBodyColor);

            if (this.isCircle)
            {
                graphic.strokeCircle(x, y, this.radius);
            }
            else
            {
                graphic.strokeRect(pos.x, pos.y, this.width, this.height);
            }
        }

        if (this.debugShowVelocity)
        {
            graphic.lineStyle(1, this.world.defaults.velocityDebugColor, 1);
            graphic.lineBetween(x, y, x + this.velocity.x / 2, y + this.velocity.y / 2);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#willDrawDebug
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    willDrawDebug: function ()
    {
        return (this.debugShowBody || this.debugShowVelocity);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setCollideWorldBounds
     * @since 3.0.0
     *
     * @param {boolean} value - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setCollideWorldBounds: function (value)
    {
        this.collideWorldBounds = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setVelocity
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setVelocity: function (x, y)
    {
        this.velocity.set(x, y);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setVelocityX
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setVelocityX: function (value)
    {
        this.velocity.x = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setVelocityY
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setVelocityY: function (value)
    {
        this.velocity.y = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setBounce
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setBounce: function (x, y)
    {
        this.bounce.set(x, y);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setBounceX
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setBounceX: function (value)
    {
        this.bounce.x = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setBounceY
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setBounceY: function (value)
    {
        this.bounce.y = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setAcceleration
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAcceleration: function (x, y)
    {
        this.acceleration.set(x, y);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setAccelerationX
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAccelerationX: function (value)
    {
        this.acceleration.x = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setAccelerationY
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAccelerationY: function (value)
    {
        this.acceleration.y = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setDrag
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setDrag: function (x, y)
    {
        this.drag.set(x, y);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setDragX
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setDragX: function (value)
    {
        this.drag.x = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setDragY
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setDragY: function (value)
    {
        this.drag.y = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setGravity
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setGravity: function (x, y)
    {
        this.gravity.set(x, y);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setGravityX
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setGravityX: function (value)
    {
        this.gravity.x = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setGravityY
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setGravityY: function (value)
    {
        this.gravity.y = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setFriction
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setFriction: function (x, y)
    {
        this.friction.set(x, y);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setFrictionX
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setFrictionX: function (value)
    {
        this.friction.x = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setFrictionY
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setFrictionY: function (value)
    {
        this.friction.y = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setAngularVelocity
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAngularVelocity: function (value)
    {
        this.angularVelocity = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setAngularAcceleration
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAngularAcceleration: function (value)
    {
        this.angularAcceleration = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setAngularDrag
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setAngularDrag: function (value)
    {
        this.angularDrag = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setMass
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setMass: function (value)
    {
        this.mass = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Body#setImmovable
     * @since 3.0.0
     *
     * @param {boolean} value - [description]
     *
     * @return {Phaser.Physics.Arcade.Body} This Body object.
     */
    setImmovable: function (value)
    {
        this.immovable = value;

        return this;
    },

    /**
     * [description]
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
     * [description]
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
     * [description]
     *
     * @name Phaser.Physics.Arcade.Body#left
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
     * @name Phaser.Physics.Arcade.Body#right
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
     * @name Phaser.Physics.Arcade.Body#top
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
     * @name Phaser.Physics.Arcade.Body#bottom
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

module.exports = Body;
