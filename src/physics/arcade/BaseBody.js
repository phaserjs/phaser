/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var CircleContains = require('../../geom/circle/Contains');
var CONST = require('./const');
var RectangleContains = require('../../geom/rectangle/Contains');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * A Base Physics Body. Cannot be used directly on its own.
 * 
 * This class is extended by Dynamic Body and Static Body.
 *
 * @class BaseBody
 * @memberof Phaser.Physics.Arcade
 * @constructor
 * @since 3.17.0
 *
 * @param {Phaser.Physics.Arcade.World} world - The Arcade Physics simulation this Body belongs to.
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object this Body belongs to. Pass `null` if this Body should not be bound to a Game Object.
 * @param {integer} bodyType - The physics body type, either Dynamic or Static.
 * @param {number} [x] - The horizontal position of this Body in the physics world. If undefined and a Game Object is provided it will use the Game Objects position.
 * @param {number} [y] - The vertical position of this Body in the physics world. If undefined and a Game Object is provided it will use the Game Objects position.
 * @param {number} [width] - The width of the Body in pixels. If undefined and a Game Object is provided it will use the Game Objects frame size.
 * @param {number} [height] - The height of the Body in pixels. If undefined and a Game Object is provided it will use the Game Objects frame size.
 */
var BaseBody = new Class({

    initialize:

    function BaseBody (world, gameObject, bodyType, x, y, width, height)
    {
        if (width === undefined) { width = 64; }
        if (height === undefined) { height = 64; }
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        if (gameObject)
        {
            width = gameObject.width;
            height = gameObject.height;

            x = gameObject.x - gameObject.displayOriginX;
            y = gameObject.y - gameObject.displayOriginY;
        }

        /**
         * The Arcade Physics simulation this Body belongs to.
         *
         * @name Phaser.Physics.Arcade.BaseBody#world
         * @type {Phaser.Physics.Arcade.World}
         * @since 3.0.0
         */
        this.world = world;

        /**
         * Quick boolean body check.
         *
         * @name Phaser.Physics.Arcade.BaseBody#isBody
         * @type {boolean}
         * @readonly
         * @since 3.17.0
         */
        this.isBody = true;

        /**
         * The Game Object this Body belongs to.
         * 
         * As of Phaser 3.17 this can be null in order to create a Body that isn't bound to a parent,
         * but that still collides and overlaps within the physics world.
         *
         * @name Phaser.Physics.Arcade.BaseBody#gameObject
         * @type {?Phaser.GameObjects.GameObject}
         * @since 3.0.0
         */
        this.gameObject = gameObject;

        /**
         * The physics body type, either Dynamic or Static.
         *
         * @name Phaser.Physics.Arcade.BaseBody#physicsType
         * @type {integer}
         * @since 3.0.0
         */
        this.physicsType = bodyType;

        /**
         * Whether this Body is updated by the physics simulation.
         *
         * @name Phaser.Physics.Arcade.BaseBody#enable
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.enable = true;

        var defaults = world.defaults;

        /**
         * Whether the Body's boundary is drawn to the debug display.
         *
         * @name Phaser.Physics.Arcade.BaseBody#debugShowBody
         * @type {boolean}
         * @since 3.0.0
         */
        this.debugShowBody = defaults.debugShowBody;

        /**
         * Whether the Body's velocity is drawn to the debug display.
         *
         * @name Phaser.Physics.Arcade.BaseBody#debugShowVelocity
         * @type {boolean}
         * @since 3.0.0
         */
        this.debugShowVelocity = defaults.debugShowVelocity;

        /**
         * Whether the Body's blocked faces are drawn to the debug display.
         *
         * @name Phaser.Physics.Arcade.BaseBody#debugShowVelocity
         * @type {boolean}
         * @since 3.17.0
         */
        this.debugShowBlocked = defaults.debugShowBlocked;

        /**
         * The color of this Body on the debug display.
         *
         * @name Phaser.Physics.Arcade.BaseBody#debugBodyColor
         * @type {integer}
         * @since 3.0.0
         */
        this.debugBodyColor = defaults.bodyDebugColor;

        /**
         * Whether this Body's boundary is circular (`true`) or rectangular (`false`).
         * The default is for all bodies to be rectangles based on the parent Game Object frame size.
         *
         * @name Phaser.Physics.Arcade.BaseBody#isCircle
         * @type {boolean}
         * @default false
         * @since 3.0.0
         * @see Phaser.Physics.Arcade.BaseBody#setCircle
         */
        this.isCircle = false;

        /**
         * If this Body is circular, this is the unscaled radius of the Body's boundary, as set by {@link #setCircle}, in source pixels.
         * The true radius is equal to `halfWidth`.
         *
         * @name Phaser.Physics.Arcade.BaseBody#radius
         * @type {number}
         * @default 0
         * @since 3.0.0
         * @see Phaser.Physics.Arcade.BaseBody#setCircle
         */
        this.radius = 0;

        /**
         * The offset of this Body's position from its Game Object's position, in source pixels.
         *
         * Unlike dynamic bodies, a Static Body does not follow its Game Object. As such, this offset is only applied when resizing the Static Body.
         *
         * @name Phaser.Physics.Arcade.BaseBody#offset
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         * @see Phaser.Physics.Arcade.BaseBody#setOffset
         */
        this.offset = new Vector2();

        /**
         * The position of this Body within the simulation.
         *
         * @name Phaser.Physics.Arcade.BaseBody#position
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.position = new Vector2(x, y);

        /**
         * The position of this Body during the previous step.
         *
         * @name Phaser.Physics.Arcade.BaseBody#prev
         * @type {Phaser.Math.Vector2}
         * @since 3.17.0
         */
        this.prev = new Vector2(x, y);

        /**
         * The width of the Static Body's boundary, in pixels.
         * If the Static Body is circular, this is also the Static Body's diameter.
         *
         * @name Phaser.Physics.Arcade.BaseBody#width
         * @type {number}
         * @since 3.0.0
         */
        this.width = width;

        /**
         * The height of the Static Body's boundary, in pixels.
         * If the Static Body is circular, this is also the Static Body's diameter.
         *
         * @name Phaser.Physics.Arcade.BaseBody#height
         * @type {number}
         * @since 3.0.0
         */
        this.height = height;

        /**
         * Half the Body's width, in pixels.
         * If the Body is circular, this is also the radius.
         *
         * @name Phaser.Physics.Arcade.BaseBody#halfWidth
         * @type {number}
         * @since 3.0.0
         */
        this.halfWidth = Math.abs(width / 2);

        /**
         * Half the Body's height, in pixels.
         * If the Body is circular, this is also the radius.
         *
         * @name Phaser.Physics.Arcade.BaseBody#halfHeight
         * @type {number}
         * @since 3.0.0
         */
        this.halfHeight = Math.abs(height / 2);

        /**
         * The center of the Body's boundary.
         * The midpoint of its `position` (top-left corner) and its bottom-right corner.
         *
         * @name Phaser.Physics.Arcade.BaseBody#center
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.center = new Vector2(x + this.halfWidth, y + this.halfHeight);

        /**
         * Whether this Body's position is affected by gravity (local or world).
         * 
         * Changing this property has no impact on a Static Body.
         *
         * @name Phaser.Physics.Arcade.BaseBody#allowGravity
         * @type {boolean}
         * @default true
         * @since 3.0.0
         * @see Phaser.Physics.Arcade.BaseBody#gravity
         * @see Phaser.Physics.Arcade.World#gravity
         */
        this.allowGravity = true;

        /**
         * The Body's inertia, relative to a default unit (1).
         * With `bounce`, this affects the exchange of momentum (velocities) during collisions.
         *
         * @name Phaser.Physics.Arcade.BaseBody#mass
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.mass = 1;

        /**
         * Whether this Body can be moved by collisions with another Body.
         * 
         * A Static Body is always immovable.
         *
         * @name Phaser.Physics.Arcade.BaseBody#immovable
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.immovable = false;

        /**
         * A flag disabling the default horizontal separation of colliding bodies.
         * Pass your own `collideCallback` to the collider.
         *
         * @name Phaser.Physics.Arcade.BaseBody#customSeparateX
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.customSeparateX = false;

        /**
         * A flag disabling the default vertical separation of colliding bodies.
         * Pass your own `collideCallback` to the collider.
         *
         * @name Phaser.Physics.Arcade.BaseBody#customSeparateY
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.customSeparateY = false;

        /**
         * Whether this Body interacts with the world boundary.
         *
         * @name Phaser.Physics.Arcade.BaseBody#collideWorldBounds
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.collideWorldBounds = false;

        /**
         * Whether this Body is checked for collisions and for which directions.
         * You can set `checkCollision.none = true` to disable collision checks.
         *
         * @name Phaser.Physics.Arcade.BaseBody#checkCollision
         * @type {Phaser.Physics.Arcade.Types.ArcadeBodyCollision}
         * @since 3.0.0
         */
        this.checkCollision = { none: false, up: true, down: true, left: true, right: true };

        /**
         * Whether this Body is colliding with another and in which direction.
         *
         * @name Phaser.Physics.Arcade.BaseBody#touching
         * @type {Phaser.Physics.Arcade.Types.ArcadeBodyCollision}
         * @since 3.0.0
         */
        this.touching = { none: true, up: false, down: false, left: false, right: false };

        /**
         * Whether this Body was colliding with another during the last step, and in which direction.
         *
         * @name Phaser.Physics.Arcade.BaseBody#wasTouching
         * @type {Phaser.Physics.Arcade.Types.ArcadeBodyCollision}
         * @since 3.0.0
         */
        this.wasTouching = { none: true, up: false, down: false, left: false, right: false };

        /**
         * Whether this Body is blocked from moving in a given direction.
         *
         * @name Phaser.Physics.Arcade.BaseBody#blocked
         * @type {Phaser.Physics.Arcade.Types.ArcadeBodyCollision}
         * @since 3.0.0
         */
        this.blocked = { none: true, up: false, down: false, left: false, right: false };

        /**
         * Whether this Body is colliding with a tile or the world boundary.
         *
         * @name Phaser.Physics.Arcade.BaseBody#worldBlocked
         * @type {Phaser.Physics.Arcade.Types.ArcadeBodyCollision}
         * @since 3.17.0
         */
        this.worldBlocked = { none: true, up: false, down: false, left: false, right: false };

        /**
         * Whether this Body is hard blocked, i.e. touching another Body that cannot be moved.
         *
         * @name Phaser.Physics.Arcade.BaseBody#hardBlocked
         * @type {Phaser.Physics.Arcade.Types.ArcadeBodyCollision}
         * @since 3.17.0
         */
        this.hardBlocked = { none: true, up: false, down: false, left: false, right: false };

        /**
         * Whether the simulation emits a `worldbounds` event when this Body collides with the world boundary (and `collideWorldBounds` is also true).
         * 
         * Always false for a Static Body as Static Bodies never collide with the world boundary and never trigger a `worldbounds` event.
         *
         * @name Phaser.Physics.Arcade.BaseBody#onWorldBounds
         * @type {boolean}
         * @default false
         * @since 3.0.0
         * @see Phaser.Physics.Arcade.Events#WORLD_BOUNDS
         */
        this.onWorldBounds = false;

        /**
         * Whether the simulation emits a `collide` event when this Body collides with another.
         *
         * @name Phaser.Physics.Arcade.BaseBody#onCollide
         * @type {boolean}
         * @default false
         * @since 3.0.0
         * @see Phaser.Physics.Arcade.Events#COLLIDE
         */
        this.onCollide = false;

        /**
         * Whether the simulation emits an `overlap` event when this Body overlaps with another.
         *
         * @name Phaser.Physics.Arcade.BaseBody#onOverlap
         * @type {boolean}
         * @default false
         * @since 3.0.0
         * @see Phaser.Physics.Arcade.Events#OVERLAP
         */
        this.onOverlap = false;

        /**
         * Whether the simulation emits a `touch` event when this Body touches another.
         *
         * @name Phaser.Physics.Arcade.BaseBody#onTouch
         * @type {boolean}
         * @default false
         * @since 3.17.0
         * @see Phaser.Physics.Arcade.Events#TOUCH
         */
        this.onTouch = false;

        /**
         * The calculated change in the Body's horizontal position during the last step.
         *
         * @name Phaser.Physics.Arcade.BaseBody#_dx
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._dx = 0;

        /**
         * The calculated change in the Body's vertical position during the last step.
         *
         * @name Phaser.Physics.Arcade.BaseBody#_dy
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */
        this._dy = 0;
    },

    /**
     * Updates the Body's `center` from its `position`, `width`, and `height`.
     *
     * @method Phaser.Physics.Arcade.BaseBody#updateCenter
     * @since 3.0.0
     */
    updateCenter: function ()
    {
        this.center.set(this.position.x + this.halfWidth, this.position.y + this.halfHeight);
    },

    /**
     * Returns the x and y coordinates of the top left and bottom right points of the StaticBody.
     *
     * @method Phaser.Physics.Arcade.BaseBody#getBounds
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.Types.ArcadeBodyBounds} obj - The object which will hold the coordinates of the bounds.
     *
     * @return {Phaser.Physics.Arcade.Types.ArcadeBodyBounds} The same object that was passed with `x`, `y`, `right` and `bottom` values matching the respective values of the StaticBody.
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
     * Checks to see if a given x,y coordinate is within this bodies boundary.
     *
     * @method Phaser.Physics.Arcade.BaseBody#hitTest
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
     * Draws this Body's boundary and velocity, if enabled.
     *
     * @method Phaser.Physics.Arcade.BaseBody#drawDebug
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Graphics} graphic - The Graphics object to draw on.
     */
    drawDebug: function (graphic)
    {
        var pos = this.position;

        var x = pos.x + this.halfWidth;
        var y = pos.y + this.halfHeight;

        var defaults = this.world.defaults;

        var worldBlockedColor = defaults.worldBlockedDebugColor;
        var blockedColor = defaults.blockedDebugColor;
        var sleepColor = defaults.sleepDebugColor;
        var checkCollision = this.checkCollision;

        // var thickness = graphic.defaultStrokeWidth;

        var thickness = 2;
        var halfThickness = thickness / 2;

        //  Top Left
        var x1 = pos.x;
        var y1 = pos.y;

        //  Top Right
        var x2 = this.right;
        var y2 = y1;

        //  Bottom Left
        var x3 = x1;
        var y3 = this.bottom;

        //  Bottom Right
        var x4 = x2;
        var y4 = y3;

        var blocked = this.blocked;
        var worldBlocked = this.worldBlocked;
        var hardBlocked = this.hardBlocked;

        var color;

        if (this.debugShowBody)
        {
            //  Top
            if (checkCollision.up)
            {
                color = (this.sleeping) ? sleepColor : this.debugBodyColor;

                if (blocked.up || worldBlocked.up || hardBlocked.up)
                {
                    color = (worldBlocked.up || hardBlocked.up) ? worldBlockedColor : blockedColor;
                }
    
                graphic.lineStyle(thickness, color).lineBetween(x1, y1 + halfThickness, x2, y2 + halfThickness);
            }

            //  Bottom
            if (checkCollision.down)
            {
                color = (this.sleeping) ? sleepColor : this.debugBodyColor;

                if (blocked.down || worldBlocked.down || hardBlocked.down)
                {
                    color = (worldBlocked.down || hardBlocked.down) ? worldBlockedColor : blockedColor;
                }
    
                graphic.lineStyle(thickness, color).lineBetween(x3, y3 - halfThickness, x4, y4 - halfThickness);
            }

            //  Left
            if (checkCollision.left)
            {
                color = (this.sleeping) ? sleepColor : this.debugBodyColor;

                if (blocked.left || worldBlocked.left || hardBlocked.left)
                {
                    color = (worldBlocked.left || hardBlocked.left) ? worldBlockedColor : blockedColor;
                }
    
                graphic.lineStyle(thickness, color).lineBetween(x1 + halfThickness, y1, x3 + halfThickness, y3);
            }

            //  Right
            if (checkCollision.right)
            {
                color = (this.sleeping) ? sleepColor : this.debugBodyColor;

                if (blocked.right || worldBlocked.right || hardBlocked.right)
                {
                    color = (worldBlocked.right || hardBlocked.right) ? worldBlockedColor : blockedColor;
                }
    
                graphic.lineStyle(thickness, color).lineBetween(x2 - halfThickness, y2, x4 - halfThickness, y4);
            }
        }

        // if (this.isCircle)
        // {
        //     graphic.strokeCircle(x, y, this.width / 2);
        // }

        if (this.debugShowVelocity)
        {
            graphic.lineStyle(thickness, defaults.velocityDebugColor, 1);
            graphic.lineBetween(x, y, x + this.velocity.x / 2, y + this.velocity.y / 2);
        }
    },

    /**
     * Whether this Body will be drawn to the debug display.
     *
     * @method Phaser.Physics.Arcade.BaseBody#willDrawDebug
     * @since 3.0.0
     *
     * @return {boolean} True if either `debugShowBody` or `debugShowVelocity` are enabled.
     */
    willDrawDebug: function ()
    {
        return (this.debugShowBody || this.debugShowVelocity);
    },

    setTouchingUp: function ()
    {
        var touching = this.touching;

        touching.up = true;
        touching.none = false;

        return this;
    },

    setTouchingDown: function ()
    {
        var touching = this.touching;

        touching.down = true;
        touching.none = false;

        return this;
    },

    setTouchingLeft: function ()
    {
        var touching = this.touching;

        touching.left = true;
        touching.none = false;

        return this;
    },

    setTouchingRight: function ()
    {
        var touching = this.touching;

        touching.right = true;
        touching.none = false;

        return this;
    },

    setHardBlockedUp: function ()
    {
        var hardBlocked = this.hardBlocked;

        hardBlocked.none = false;
        hardBlocked.up = true;

        return this;
    },

    setHardBlockedDown: function ()
    {
        var hardBlocked = this.hardBlocked;

        hardBlocked.none = false;
        hardBlocked.down = true;

        return this;
    },

    setHardBlockedLeft: function ()
    {
        var hardBlocked = this.hardBlocked;

        hardBlocked.none = false;
        hardBlocked.left = true;

        return this;
    },

    setHardBlockedRight: function ()
    {
        var hardBlocked = this.hardBlocked;

        hardBlocked.none = false;
        hardBlocked.right = true;

        return this;
    },

    setWorldBlockedUp: function (forceY)
    {
        var worldBounds = this.world.bounds;
        var worldBlocked = this.worldBlocked;
        var worldCollision = this.world.checkCollision;

        if (!worldCollision.up)
        {
            return;
        }

        worldBlocked.up = true;
        worldBlocked.none = false;

        if (forceY && this.y !== worldBounds.y)
        {
            this.y = worldBounds.y;

            this.forcePosition = 5;
        }

        return this;
    },

    setWorldBlockedDown: function (forceY)
    {
        var worldBounds = this.world.bounds;
        var worldBlocked = this.worldBlocked;
        var worldCollision = this.world.checkCollision;

        if (!worldCollision.down)
        {
            return;
        }

        worldBlocked.down = true;
        worldBlocked.none = false;

        if (forceY && this.bottom !== worldBounds.bottom)
        {
            this.bottom = worldBounds.bottom;

            this.forcePosition = 5;
        }

        return this;
    },

    setWorldBlockedLeft: function (forceX)
    {
        var worldBounds = this.world.bounds;
        var worldBlocked = this.worldBlocked;
        var worldCollision = this.world.checkCollision;

        if (!worldCollision.left)
        {
            return;
        }

        worldBlocked.left = true;
        worldBlocked.none = false;

        if (forceX && this.x !== worldBounds.x)
        {
            this.x = worldBounds.x;

            this.forcePosition = 5;
        }

        return this;
    },

    setWorldBlockedRight: function (forceX)
    {
        var worldBounds = this.world.bounds;
        var worldBlocked = this.worldBlocked;
        var worldCollision = this.world.checkCollision;

        if (!worldCollision.right)
        {
            return;
        }

        worldBlocked.right = true;
        worldBlocked.none = false;

        if (forceX && this.right !== worldBounds.right)
        {
            this.right = worldBounds.right;

            this.forcePosition = 5;
        }

        return this;
    },

    isBlocked: function ()
    {
        return (!this.blocked.none || !this.worldBlocked.none || !this.hardBlocked.none);
    },

    isBlockedUp: function ()
    {
        return (this.immovable || this.blocked.up || this.worldBlocked.up || this.hardBlocked.up);
    },

    isBlockedDown: function ()
    {
        return (this.immovable || this.blocked.down || this.worldBlocked.down || this.hardBlocked.down);
    },

    isBlockedLeft: function ()
    {
        return (this.immovable || this.blocked.left || this.worldBlocked.left || this.hardBlocked.left);
    },

    isBlockedRight: function ()
    {
        return (this.immovable || this.blocked.right || this.worldBlocked.right || this.hardBlocked.right);
    },

    isWorldBlockedUp: function ()
    {
        return (this.immovable || this.worldBlocked.up || this.hardBlocked.up);
    },

    isWorldBlockedDown: function ()
    {
        return (this.immovable || this.worldBlocked.down || this.hardBlocked.down);
    },

    isWorldBlockedLeft: function ()
    {
        return (this.immovable || this.worldBlocked.left || this.hardBlocked.left);
    },

    isWorldBlockedRight: function ()
    {
        return (this.immovable || this.worldBlocked.right || this.hardBlocked.right);
    },

    //  Is this body world blocked AND blocked on the opposite face?
    isBlockedX: function ()
    {
        var blocked = this.blocked;
        var worldBlocked = this.worldBlocked;
        var hardBlocked = this.hardBlocked;

        return (
            ((worldBlocked.right || hardBlocked.right) && blocked.left) ||
            ((worldBlocked.left || hardBlocked.left) && blocked.right)
        );
    },

    isBlockedY: function ()
    {
        var blocked = this.blocked;
        var worldBlocked = this.worldBlocked;
        var hardBlocked = this.hardBlocked;

        return (
            ((worldBlocked.down || hardBlocked.down) && blocked.up) ||
            ((worldBlocked.up || hardBlocked.up) && blocked.down)
        );
    },

    getShareX: function (amount)
    {
        var diff = amount;
        var bounds = this.world.bounds;

        if (amount === 0 || this.immovable)
        {
            return 0;
        }
        else
        {
            if (this.collideWorldBounds)
            {
                var worldCollision = this.world.checkCollision;
    
                if (amount < 0 && worldCollision.left && this.x + amount < bounds.x)
                {
                    return amount - ((this.x + amount) - bounds.x);
                }
                else if (amount > 0 && worldCollision.right && this.right + amount > bounds.right)
                {
                    return amount - ((this.right + amount) - bounds.right);
                }
            }

            if (amount < 0 && this.isBlockedLeft())
            {
                bounds = this.getBlocker(this.blockers.left);

                if (bounds && this.x + amount < bounds.x)
                {
                    return amount - ((this.x + amount) - bounds.x);
                }
            }
            else if (amount > 0 && this.isBlockedRight())
            {
                bounds = this.getBlocker(this.blockers.right);
    
                if (bounds && this.right + amount > bounds.right)
                {
                    return amount - ((this.right + amount) - bounds.right);
                }
            }
        }

        return diff;
    },

    getShareY: function (amount)
    {
        var diff = amount;
        var bounds = this.world.bounds;

        if (amount === 0 || this.immovable)
        {
            return 0;
        }
        else
        {
            if (this.collideWorldBounds)
            {
                var worldCollision = this.world.checkCollision;
    
                if (amount < 0 && worldCollision.up && this.y + amount < bounds.y)
                {
                    return amount - ((this.y + amount) - bounds.y);
                }
                else if (amount > 0 && worldCollision.down && this.bottom + amount > bounds.bottom)
                {
                    return amount - ((this.bottom + amount) - bounds.bottom);
                }
            }

            if (amount < 0 && this.isBlockedUp())
            {
                bounds = this.getBlocker(this.blockers.up);

                if (bounds && this.y + amount < bounds.y)
                {
                    return amount - ((this.y + amount) - bounds.y);
                }
            }
            else if (amount > 0 && this.isBlockedDown())
            {
                bounds = this.getBlocker(this.blockers.down);
    
                if (bounds && this.bottom + amount > bounds.bottom)
                {
                    return amount - ((this.bottom + amount) - bounds.bottom);
                }
            }
        }

        return diff;
    },

    /**
     * Sets the Mass of the StaticBody. Will set the Mass to 0.1 if the value passed is less than or equal to zero.
     *
     * @method Phaser.Physics.Arcade.BaseBody#setMass
     * @since 3.0.0
     *
     * @param {number} value - The value to set the Mass to. Values of zero or less are changed to 0.1.
     *
     * @return {Phaser.Physics.Arcade.BaseBody} This Static Body object.
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
     * Sets the Body's `enable` property.
     *
     * @method Phaser.Physics.Arcade.BaseBody#setEnable
     * @since 3.15.0
     *
     * @param {boolean} [value=true] - The value to assign to `enable`.
     *
     * @return {Phaser.Physics.Arcade.BaseBody} This Body object.
     */
    setEnable: function (value)
    {
        if (value === undefined) { value = true; }

        this.enable = value;

        return this;
    },

    /**
     * Changes the Game Object this Body is bound to.
     * First it removes its reference from the old Game Object, then sets the new one.
     * You can optionally update the position and dimensions of this Body to reflect that of the new Game Object.
     *
     * @method Phaser.Physics.Arcade.BaseBody#setGameObject
     * @since 3.1.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The new Game Object that will own this Body.
     * @param {boolean} [update=true] - Reposition and resize this Body to match the new Game Object?
     *
     * @return {Phaser.Physics.Arcade.BaseBody} This Static Body object.
     *
     * @see Phaser.Physics.Arcade.BaseBody#updateFromGameObject
     */
    setGameObject: function (gameObject, update)
    {
        if (update === undefined) { update = true; }

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

    //  Return false if this body is:
    //    Static or Immovable
    //    Under direct movement control
    //    Has bounce and is moving left but is blocked right, or is moving right and is blocked left
    //  Otherwise, return true
    canMoveX: function ()
    {
        if (this.physicsType === CONST.STATIC_BODY || this.immovable || !this.moves)
        {
            //  Static bodies don't move
            return false;
        }

        var bounceX = this.bounce.x;
        var velocityX = this.velocity.x;

        if (bounceX && ((velocityX < 0 && this.isWorldBlockedRight()) || (velocityX > 0 && this.isWorldBlockedLeft())))
        {
            return false;
        }

        return true;
    },

    //  Return false if this body is:
    //    Static or Immovable
    //    Under direct movement control
    //    Has bounce and is moving up but is blocked down, or is moving down and is blocked up
    //  Otherwise, return true
    canMoveY: function ()
    {
        if (this.physicsType === CONST.STATIC_BODY || this.immovable || !this.moves)
        {
            //  Static bodies don't move
            return false;
        }

        var bounceY = this.bounce.y;
        var velocityY = this.velocity.y;

        if (bounceY && ((velocityY < 0 && this.isWorldBlockedDown()) || (velocityY > 0 && this.isWorldBlockedUp())))
        {
            return false;
        }

        return true;
    },

    setCheckCollisionUp: function (value)
    {
        this.checkCollision.up = value;

        return this;
    },

    setCheckCollisionDown: function (value)
    {
        this.checkCollision.down = value;

        return this;
    },

    setCheckCollisionLeft: function (value)
    {
        this.checkCollision.left = value;

        return this;
    },

    setCheckCollisionRight: function (value)
    {
        this.checkCollision.right = value;

        return this;
    },

    setCheckCollisionX: function (value)
    {
        this.setCheckCollisionLeft(value);

        return this.setCheckCollisionRight(value);
    },

    setCheckCollisionY: function (value)
    {
        this.setCheckCollisionUp(value);

        return this.setCheckCollisionDown(value);
    },

    setCheckCollisionNone: function ()
    {
        this.checkCollision.none = true;

        return this;
    },

    setCheckCollisionAll: function ()
    {
        this.checkCollision.none = false;

        this.setCheckCollisionX(true);

        return this.setCheckCollisionY(true);
    },

    /**
     * Disables this Body and marks it for deletion by the simulation.
     *
     * @method Phaser.Physics.Arcade.BaseBody#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.enable = false;

        if (this.world)
        {
            this.world.pendingDestroy.set(this);
        }

        var blockers = this.blockers;

        if (blockers)
        {
            blockers.up = [];
            blockers.down = [];
            blockers.left = [];
            blockers.right = [];
        }
    }

});

module.exports = BaseBody;
