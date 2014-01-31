/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/*

The SKPhysicsBody class defines properties that determine how the physics body is simulated. These properties affect how the body reacts to forces, what forces it generates on itself (to simulate friction), and how it reacts to collisions in the scene. In most cases, the properties are used to simulate physical effects.

Each individual body also has its own property values that determine exactly how it reacts to forces and collisions in the scene. Here are the most important properties:

The mass property determines how forces affect the body, as well as how much momentum the body has when it is involved in a collision.
The friction property determines the roughness of the body’s surface. It is used to calculate the frictional force that a body applies to other bodies moving along its surface.
The linearDamping and angularDamping properties are used to calculate friction on the body as it moves through the world. For example, this might be used to simulate air or water friction.
The restitution property determines how much energy a body maintains during a collision—its bounciness.
Other properties are used to determine how the simulation is performed on the body itself:

The dynamic property determines whether the body is simulated by the physics subsystem.
The affectedByGravity property determines whether the simulation exerts a gravitational force on the body. For more information on the physics world, see “Configuring the Physics World.”
The allowsRotation property determines whether forces can impart angular velocity on the body.


*/



/**
* The Physics Body is linked to a single Sprite. All physics operations should be performed against the body rather than
* the Sprite itself. For example you can set the velocity, acceleration, bounce values etc all on the Body.
*
* @class Phaser.Physics.Arcade.Body
* @classdesc Arcade Physics Body Constructor
* @constructor
* @param {Phaser.Sprite} sprite - The Sprite object this physics body belongs to.
*/
Phaser.Physics.Arcade.Body = function (sprite) {

    /**
    * @property {Phaser.Sprite} sprite - Reference to the parent Sprite.
    */
    this.sprite = sprite;

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = sprite.game;

    /**
    * @property {Phaser.Point} offset - The offset of the Physics Body from the Sprite x/y position.
    */
    this.offset = new Phaser.Point();

    /**
    * @property {number} preX - The previous x position of the physics body.
    * @readonly
    */
    this.preX = sprite.world.x;

    /**
    * @property {number} preY - The previous y position of the physics body.
    * @readonly
    */
    this.preY = sprite.world.y;

    /**
    * @property {number} preRotation - The previous rotation of the physics body.
    * @readonly
    */
    this.preRotation = sprite.angle;

    /**
    * @property {Phaser.Point} velocity - The velocity of the Body.
    */
    this.velocity = new Phaser.Point();

    /**
    * @property {Phaser.Point} acceleration - The acceleration in pixels per second sq. of the Body.
    */
    this.acceleration = new Phaser.Point();

    /**
    * @property {number} speed - The speed in pixels per second sq. of the Body.
    */
    this.speed = 0;

    /**
    * @property {number} angle - The angle of the Body based on its velocity in radians.
    */
    this.angle = 0;

    /**
    * @property {Phaser.Point} gravity - The gravity applied to the motion of the Body. This works in addition to any gravity set on the world.
    */
    this.gravity = new Phaser.Point();

    /**
    * @property {Phaser.Point} bounce - The elasticitiy of the Body when colliding. bounce.x/y = 1 means full rebound, bounce.x/y = 0.5 means 50% rebound velocity.
    */
    this.bounce = new Phaser.Point();

    /**
    * @property {Phaser.Point} minVelocity - When a body rebounds off another body or a wall the minVelocity is checked. If the new velocity is lower than minVelocity the body is stopped.
    * @default
    */
    this.minVelocity = new Phaser.Point();

    /**
    * @property {Phaser.Point} maxVelocity - The maximum velocity that the Body can reach.
    * @default
    */
    this.maxVelocity = new Phaser.Point(1000, 1000);

    /**
    * @property {number} angularVelocity - The angular velocity of the Body.
    * @default
    */
    this.angularVelocity = 0;

    /**
    * @property {number} angularAcceleration - The angular acceleration of the Body.
    * @default
    */
    this.angularAcceleration = 0;

    /**
    * @property {number} angularDrag - The angular drag applied to the rotation of the Body.
    * @default
    */
    this.angularDrag = 0;

    /**
    * @property {number} maxAngular - The maximum angular velocity that the Body can reach.
    * @default
    */
    this.maxAngular = 1000;

    /**
    * @property {number} mass - The mass of the Body.
    * @default
    */
    this.mass = 1;

    /**
    * @property {number} friction - The amount of friction this body experiences during motion.
    * @default
    */
    this.friction = 0.0;

    /**
    * Set the checkCollision properties to control which directions collision is processed for this Body.
    * For example checkCollision.up = false means it won't collide when the collision happened while moving up.
    * @property {object} checkCollision - An object containing allowed collision.
    */
    this.checkCollision = { none: false, any: true, up: true, down: true, left: true, right: true };

    /**
    * This object is populated with boolean values when the Body collides with another.
    * touching.up = true means the collision happened to the top of this Body for example.
    * @property {object} touching - An object containing touching results.
    */
    this.touching = { none: true, up: false, down: false, left: false, right: false };

    /**
    * This object is populated with boolean values when the Body collides with the World bounds or a Tile.
    * For example if blocked.up is true then the Body cannot move up.
    * @property {object} blocked - An object containing on which faces this Body is blocked from moving, if any.
    */
    this.blocked = { x: 0, y: 0, up: false, down: false, left: false, right: false };

    /**
    * @property {number} facing - A const reference to the direction the Body is traveling or facing.
    * @default
    */
    this.facing = Phaser.NONE;

    /**
    * @property {boolean} rebound - A Body set to rebound will exchange velocity with another Body during collision. Set to false to allow this body to be 'pushed' rather than exchange velocity.
    * @default
    */
    this.rebound = true;

    /**
    * @property {boolean} immovable - An immovable Body will not receive any impacts or exchanges of velocity from other bodies.
    * @default
    */
    this.immovable = false;

    /**
    * @property {boolean} moves - Set to true to allow the Physics system (such as velocity) to move this Body, or false to move it manually.
    * @default
    */
    this.moves = true;

    /**
    * @property {number} rotation - The amount the parent Sprite is rotated.
    * @default
    */
    this.rotation = 0;

    /**
    * @property {boolean} allowRotation - Allow angular rotation? This will cause the Sprite to be rotated via angularVelocity, etc.
    * @default
    */
    this.allowRotation = true;

    /**
    * @property {boolean} allowGravity - Allow this Body to be influenced by the global Gravity value? Note: It will always be influenced by the local gravity if set.
    * @default
    */
    this.allowGravity = true;

    /**
    * @property {function} customSeparateCallback - If set this callback will be used for Body separation instead of the built-in one. Callback should return true if separated, otherwise false.
    * @default
    */
    this.customSeparateCallback = null;

    /**
    * @property {object} customSeparateContext - The context in which the customSeparateCallback is called.
    * @default
    */
    this.customSeparateContext = null;

    /**
    * @property {function} collideCallback - If set this callback will be fired whenever this Body is hit (on any face). It will send three parameters, the face it hit on, this Body and the Body that hit it.
    * @default
    */
    this.collideCallback = null;

    /**
    * @property {object} collideCallbackContext - The context in which the collideCallback is called.
    * @default
    */
    this.collideCallbackContext = null;

    /**
    * A Body can be set to collide against the World bounds automatically and rebound back into the World if this is set to true. Otherwise it will leave the World.
    * @property {boolean} collideWorldBounds - Should the Body collide with the World bounds?
    */
    this.collideWorldBounds = false;

    /**
    * @property {Phaser.Physics.Arcade.RECT|Phaser.Physics.Arcade.CIRCLE} type - The type of SAT Shape.
    */
    this.type = Phaser.Physics.Arcade.RECT;

    /**
    * @property {SAT.Box|SAT.Circle|SAT.Polygon} shape - The SAT Collision shape.
    */
    this.shape = null;

    /**
    * @property {SAT.Polygon} polygon - The SAT Polygons, as derived from the Shape.
    */
    this.polygon = null;

    /**
    * @property {number} left - The left-most point of this Body.
    * @readonly
    */
    this.left = 0;

    /**
    * @property {number} right - The right-most point of this Body.
    * @readonly
    */
    this.right = 0;

    /**
    * @property {number} top - The top-most point of this Body.
    * @readonly
    */
    this.top = 0;

    /**
    * @property {number} bottom - The bottom-most point of this Body.
    * @readonly
    */
    this.bottom = 0;

    /**
    * @property {number} width - The current width of the Body, taking into account the point rotation.
    * @readonly
    */
    this.width = 0;

    /**
    * @property {number} height - The current height of the Body, taking into account the point rotation.
    * @readonly
    */
    this.height = 0;

    /**
    * @property {Phaser.Point} _temp - Internal cache var.
    * @private
    */
    this._temp = null;

    /**
    * @property {number} _dx - Internal cache var.
    * @private
    */
    this._dx = 0;

    /**
    * @property {number} _dy - Internal cache var.
    * @private
    */
    this._dy = 0;

    /**
    * @property {number} _sx - Internal cache var.
    * @private
    */
    this._sx = sprite.scale.x;

    /**
    * @property {number} _sy - Internal cache var.
    * @private
    */
    this._sy = sprite.scale.y;

    /**
    * @property {array} _distances - Internal cache var.
    * @private
    */
    this._distances = [0, 0, 0, 0];

    this.overlapX = 0;
    this.overlapY = 0;

    //  Velocity cache
    this._vx = 0;
    this._vy = 0;

    //  Set-up the default shape
    this.setRectangle(sprite.width, sprite.height, 0, 0);

};

Phaser.Physics.Arcade.Body.prototype = {

    /**
    * Sets this Body to use a circle of the given radius for all collision.
    * The Circle will be centered on the center of the Sprite by default, but can be adjusted via the Body.offset property and the setCircle x/y parameters.
    *
    * @method Phaser.Physics.Arcade#setCircle
    * @param {number} radius - The radius of this circle (in pixels)
    * @param {number} [offsetX=0] - The x amount the circle will be offset from the Sprites center.
    * @param {number} [offsetY=0] - The y amount the circle will be offset from the Sprites center.
    */
    setCircle: function (radius, offsetX, offsetY) {

        if (typeof offsetX === 'undefined') { offsetX = this.sprite._cache.halfWidth; }
        if (typeof offsetY === 'undefined') { offsetY = this.sprite._cache.halfHeight; }

        this.type = Phaser.Physics.Arcade.CIRCLE;
        this.shape = new SAT.Circle(new SAT.Vector(this.sprite.x, this.sprite.y), radius);
        this.polygon = null;

        this.offset.setTo(offsetX, offsetY);

    },

    /**
    * Sets this Body to use a rectangle for all collision.
    * If you don't specify any parameters it will be sized to match the parent Sprites current width and height (including scale factor) and centered on the sprite.
    *
    * @method Phaser.Physics.Arcade#setRectangle
    * @param {number} [width] - The width of the rectangle. If not specified it will default to the width of the parent Sprite.
    * @param {number} [height] - The height of the rectangle. If not specified it will default to the height of the parent Sprite.
    * @param {number} [translateX] - The x amount the rectangle will be translated from the Sprites center.
    * @param {number} [translateY] - The y amount the rectangle will be translated from the Sprites center.
    */
    setRectangle: function (width, height, translateX, translateY) {

        if (typeof width === 'undefined') { width = this.sprite.width; }
        if (typeof height === 'undefined') { height = this.sprite.height; }
        if (typeof translateX === 'undefined') { translateX = -this.sprite._cache.halfWidth; }
        if (typeof translateY === 'undefined') { translateY = -this.sprite._cache.halfHeight; }

        this.type = Phaser.Physics.Arcade.RECT;
        this.shape = new SAT.Box(new SAT.Vector(this.sprite.world.x, this.sprite.world.y), width, height);
        this.polygon = this.shape.toPolygon();
        this.polygon.translate(translateX, translateY);

        this.offset.setTo(0, 0);

    },

    /**
    * Sets this Body to use a convex polygon for collision.
    * The points are specified in a counter-clockwise direction and must create a convex polygon.
    * Use Body.translate and/or Body.offset to re-position the polygon from the Sprite origin.
    *
    * @method Phaser.Physics.Arcade#setPolygon
    * @param {array<SAT.Vector>|Array<Number>|SAT.Vector...|Number...} points - This can be an array of Vectors that form the polygon,
    *      a flat array of numbers that will be interpreted as [x,y, x,y, ...], or the arguments passed can be
    *      all the points of the polygon e.g. `setPolygon(new SAT.Vector(), new SAT.Vector(), ...)`, or the
    *      arguments passed can be flat x,y values e.g. `setPolygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers.
    */
    setPolygon: function (points) {

        this.type = Phaser.Physics.Arcade.POLYGON;
        this.shape = null;

        if (!(points instanceof Array))
        {
            points = Array.prototype.slice.call(arguments);
        }

        if (typeof points[0] === 'number')
        {
            var p = [];

            for (var i = 0, len = points.length; i < len; i += 2)
            {
                p.push(new SAT.Vector(points[i], points[i + 1]));
            }

            points = p;
        }

        this.polygon = new SAT.Polygon(new SAT.Vector(this.sprite.center.x, this.sprite.center.y), points);

        this.offset.setTo(0, 0);

    },

    /**
    * Used for translating rectangle and polygon bodies from the Sprite parent. Doesn't apply to Circles.
    * See also the Body.offset property.
    *
    * @method Phaser.Physics.Arcade#translate
    * @param {number} x - The x amount the polygon or rectangle will be translated by from the Sprite.
    * @param {number} y - The y amount the polygon or rectangle will be translated by from the Sprite.
    */
    translate: function (x, y) {

        if (this.polygon)
        {
            this.polygon.translate(x, y);
        }

    },

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade#updateScale
    * @private
    */
    updateScale: function () {

        if (this.polygon)
        {
            this.polygon.scale(this.sprite.scale.x / this._sx, this.sprite.scale.y / this._sy);
        }
        else
        {
            this.shape.r *= Math.max(this.sprite.scale.x, this.sprite.scale.y);
        }

        this._sx = this.sprite.scale.x;
        this._sy = this.sprite.scale.y;

        console.log('updateScale', this.sprite.scale.x, this.sprite.scale.y);

    },

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade#preUpdate
    * @protected
    */
    preUpdate: function () {

        this.preX = this.x;
        this.preY = this.y;
        this.preRotation = this.sprite.angle;

        this.x = (this.sprite.world.x - (this.sprite.anchor.x * this.sprite.width)) + this.offset.x;
        this.y = (this.sprite.world.y - (this.sprite.anchor.y * this.sprite.height)) + this.offset.y;
        this.rotation = this.preRotation;

        if (this.sprite.scale.x !== this._sx || this.sprite.scale.y !== this._sy)
        {
            this.updateScale();
        }

if (this.sprite.debug)
{
    console.log('Body preUpdate x:', this.x, 'y:', this.y, 'left:', this.left, 'right:', this.right, 'WAS', this.preX, this.preY);
    console.log('Body preUpdate blocked:', this.blocked, this.blockFlags);
    console.log('Body preUpdate velocity:', this.velocity.x, this.velocity.y);
    // console.log('Body preUpdate rotation:', this.rotation, this.preRotation);
}

        this.checkBlocked();

        this.touching.none = true;
        this.touching.up = false;
        this.touching.down = false;
        this.touching.left = false;
        this.touching.right = false;

        if (this.moves)
        {
            if (this._vx !== this.velocity.x || this._vy !== this.velocity.y)
            {
                //  No need to re-calc these if they haven't changed
                this._vx = this.velocity.x;
                this._vy = this.velocity.y;
                this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                this.angle = Math.atan2(this.velocity.y, this.velocity.x);
                if (this.sprite.debug)
                {
                    console.log('Body preUpdate speed / angle adjust', this.speed, this.angle);
                }
            }

            if (this.game.physics.checkBounds(this))
            {
                this.reboundCheck(true, true, true);
            }

            this.applyFriction();

            this.integrateVelocity();

            this.updateBounds();

            this.checkBlocked();
        }
        else
        {
            this.updateBounds();
        }


if (this.sprite.debug)
{
    console.log('Body preUpdate AFTER integration x:', this.x, 'y:', this.y, 'left:', this.left, 'right:', this.right);
    console.log('Body preUpdate velocity:', this.velocity.x, this.velocity.y);
}


    },

    checkBlocked: function () {

        if ((this.blocked.left || this.blocked.right) && (Math.floor(this.x) !== this.blocked.x || Math.floor(this.y) !== this.blocked.y))
        {
            // console.log('resetBlocked unlocked left + right', Math.floor(this.x), this.blocked.x);
            this.blocked.left = false;
            this.blocked.right = false;
        }

        if ((this.blocked.up || this.blocked.down) && (Math.floor(this.x) !== this.blocked.x || Math.floor(this.y) !== this.blocked.y))
        {
            // console.log('resetBlocked unlocked up + down', Math.floor(this.y), this.blocked.y, 'x', Math.floor(this.x), this.blocked.x);
            this.blocked.up = false;
            this.blocked.down = false;
        }

    },

    /**
    * Internal method that updates the left, right, top, bottom, width and height properties.
    *
    * @method Phaser.Physics.Arcade#updateBounds
    * @protected
    */
    updateBounds: function () {

        if (this.type === Phaser.Physics.Arcade.CIRCLE)
        {
            this.left = this.shape.pos.x - this.shape.r;
            this.right = this.shape.pos.x + this.shape.r;
            this.top = this.shape.pos.y - this.shape.r;
            this.bottom = this.shape.pos.y + this.shape.r;
        }
        else
        {
            this.left = Phaser.Math.minProperty('x', this.polygon.points) + this.polygon.pos.x;
            this.right = Phaser.Math.maxProperty('x', this.polygon.points) + this.polygon.pos.x;
            this.top = Phaser.Math.minProperty('y', this.polygon.points) + this.polygon.pos.y;
            this.bottom = Phaser.Math.maxProperty('y', this.polygon.points) + this.polygon.pos.y;
        }

        this.width = this.right - this.left;
        this.height = this.bottom - this.top;

    },

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade#applyFriction
    * @protected
    */
    applyFriction: function () {

        if (this.friction > 0 && this.acceleration.isZero())
        {
            if (this.speed > this.friction)
            {
                this.speed -= this.friction;
            }
            else
            {
                this.speed = 0;
            }

            //  Don't bother if speed 0
            if (this.speed > 0)
            {
                this.velocity.x = Math.cos(this.angle) * this.speed;
                this.velocity.y = Math.sin(this.angle) * this.speed;

                this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                this.angle = Math.atan2(this.velocity.y, this.velocity.x);
            }
        }

        if (this.sprite.debug)
        {
            console.log('Body applyFriction velocity:', this.velocity.x, this.velocity.y, 'speed', this.speed);
        }

    },

    /**
    * Check if we're below minVelocity and gravity isn't trying to drag us in the opposite direction.
    *
    * @method Phaser.Physics.Arcade#reboundCheck
    * @protected
    * @param {boolean} x - Check the X axis?
    * @param {boolean} y - Check the Y axis?
    * @param {boolean} rebound - If true it will reverse the velocity on the given axis
    */
    reboundCheck: function (x, y, rebound) {

        if (this.sprite.debug)
        {
            console.log('reboundCheck start', this.velocity.x, this.velocity.y);
            console.log('reBound blocked state', this.blocked);
        }

        if (x)
        {
            if (rebound && this.bounce.x !== 0 && (this.blocked.left || this.blocked.right))
            {
                this.velocity.x *= -this.bounce.x;
                this.angle = Math.atan2(this.velocity.y, this.velocity.x);

                if (this.sprite.debug)
                {
                    console.log('X rebound applied');
                }
            }

            if (this.bounce.x === 0 || Math.abs(this.velocity.x) < this.minVelocity.x)
            {
                var gx = this.getUpwardForce();

                if ((this.blocked.left && (gx < 0 || this.velocity.x < 0)) || (this.blocked.right && (gx > 0 || this.velocity.x > 0)))
                {
                    this.velocity.x = 0;

                    if (this.sprite.debug)
                    {
                        console.log('reboundCheck X zeroed');
                    }
                }
            }

            if (this.sprite.debug)
            {
                console.log('reboundCheck X', this.velocity.x, 'gravity', gx);
            }
        }

        if (y)
        {
            if (rebound && this.bounce.y !== 0 && (this.blocked.up || this.blocked.down))
            {
                this.velocity.y *= -this.bounce.y;
                this.angle = Math.atan2(this.velocity.y, this.velocity.x);

                if (this.sprite.debug)
                {
                    console.log('Y rebound applied');
                }
            }

            if (this.bounce.y === 0 || Math.abs(this.velocity.y) < this.minVelocity.y)
            {
                var gy = this.getDownwardForce();

                if ((this.blocked.up && (gy < 0 || this.velocity.y < 0)) || (this.blocked.down && (gy > 0 || this.velocity.y > 0)))
                {
                    this.velocity.y = 0;

                    if (this.sprite.debug)
                    {
                        console.log('reboundCheck Y zeroed');
                    }
                }
            }

            if (this.sprite.debug)
            {
                console.log('reboundCheck Y', this.velocity.y, 'gravity', gy);
            }
        }

    },

    /**
    * Gets the total force being applied on the X axis, including gravity and velocity.
    *
    * @method Phaser.Physics.Arcade#getUpwardForce
    * @return {number} The total force being applied on the X axis.
    */
    getUpwardForce: function () {

        if (this.allowGravity)
        {
            return this.gravity.x + this.game.physics.gravity.x + this.velocity.x;
        }
        else
        {
            return this.gravity.x + this.velocity.x;
        }

    },

    /**
    * Gets the total force being applied on the X axis, including gravity and velocity.
    *
    * @method Phaser.Physics.Arcade#getDownwardForce
    * @return {number} The total force being applied on the Y axis.
    */
    getDownwardForce: function () {

        if (this.allowGravity)
        {
            return this.gravity.y + this.game.physics.gravity.y + this.velocity.y;
        }
        else
        {
            return this.gravity.y + this.velocity.y;
        }

    },

    /**
    * Subtracts the given Vector from this Body.
    *
    * @method Phaser.Physics.Arcade#sub
    * @protected
    * @param {SAT.Vector} v - The vector to substract from this Body.
    */
    sub: function (v) {

        this.x -= v.x;
        this.y -= v.y;

    },

    /**
    * Adds the given Vector from this Body.
    *
    * @method Phaser.Physics.Arcade#add
    * @protected
    * @param {SAT.Vector} v - The vector to add to this Body.
    */
    add: function (v) {

        this.x += v.x;
        this.y += v.y;

    },

    /**
    * Separation response handler.
    *
    * @method Phaser.Physics.Arcade#give
    * @protected
    * @param {Phaser.Physics.Arcade.Body} body - The Body that collided.
    * @param {SAT.Response} response - The SAT Response object containing the collision data.
    */
    give: function (body, response) {

        this.add(response.overlapV);

        if (this.rebound)
        {
            this.processRebound(body);
            this.reboundCheck(true, true, false);
            body.reboundCheck(true, true, false);
        }

    },

    /**
    * Separation response handler.
    *
    * @method Phaser.Physics.Arcade#take
    * @protected
    * @param {Phaser.Physics.Arcade.Body} body - The Body that collided.
    * @param {SAT.Response} response - The SAT Response object containing the collision data.
    */
    take: function (body, response) {

        this.sub(response.overlapV);

        if (this.rebound)
        {
            this.processRebound(body);
            this.reboundCheck(true, true, false);
            body.reboundCheck(true, true, false);
        }

    },

    /**
    * Split the collision response evenly between the two bodies.
    *
    * @method Phaser.Physics.Arcade#split
    * @protected
    * @param {Phaser.Physics.Arcade.Body} body - The Body that collided.
    * @param {SAT.Response} response - The SAT Response object containing the collision data.
    */
    split: function (body, response) {
    
        response.overlapV.scale(0.5);
        this.sub(response.overlapV);
        body.add(response.overlapV);

        if (this.rebound)
        {
            this.exchange(body);
            this.reboundCheck(true, true, false);
            body.reboundCheck(true, true, false);
        }

    },

    /**
    * Exchange velocity with the given Body.
    *
    * @method Phaser.Physics.Arcade#exchange
    * @protected
    * @param {Phaser.Physics.Arcade.Body} body - The Body that collided.
    */
    exchange: function (body) {

        if (this.mass === body.mass && this.speed > 0 && body.speed > 0)
        {
            //  A direct velocity exchange (as they are both moving and have the same mass)
            this._dx = body.velocity.x;
            this._dy = body.velocity.y;

            body.velocity.x = this.velocity.x * body.bounce.x;
            body.velocity.y = this.velocity.y * body.bounce.x;

            this.velocity.x = this._dx * this.bounce.x;
            this.velocity.y = this._dy * this.bounce.y;
        }
        else
        {
            var nv1 = Math.sqrt((body.velocity.x * body.velocity.x * body.mass) / this.mass) * ((body.velocity.x > 0) ? 1 : -1);
            var nv2 = Math.sqrt((this.velocity.x * this.velocity.x * this.mass) / body.mass) * ((this.velocity.x > 0) ? 1 : -1);
            var average = (nv1 + nv2) * 0.5;
            nv1 -= average;
            nv2 -= average;

            this.velocity.x = nv1;
            body.velocity.x = nv2;

            nv1 = Math.sqrt((body.velocity.y * body.velocity.y * body.mass) / this.mass) * ((body.velocity.y > 0) ? 1 : -1);
            nv2 = Math.sqrt((this.velocity.y * this.velocity.y * this.mass) / body.mass) * ((this.velocity.y > 0) ? 1 : -1);
            average = (nv1 + nv2) * 0.5;
            nv1 -= average;
            nv2 -= average;

            this.velocity.y = nv1;
            body.velocity.y = nv2;
        }

        //  update speed / angle?

    },

    /**
    * Rebound the velocity of this Body.
    *
    * @method Phaser.Physics.Arcade#processRebound
    * @protected
    * @param {Phaser.Physics.Arcade.Body} body - The Body that collided.
    */
    processRebound: function (body) {

        this.velocity.x = body.velocity.x - this.velocity.x * this.bounce.x;
        this.velocity.y = body.velocity.y - this.velocity.y * this.bounce.y;

        this.angle = Math.atan2(this.velocity.y, this.velocity.x);

        this.reboundCheck(true, true, false);

    },

    /**
    * Checks for an overlap between this Body and the given Body.
    *
    * @method Phaser.Physics.Arcade#overlap
    * @param {Phaser.Physics.Arcade.Body} body - The Body that is being checked against this Body.
    * @param {SAT.Response} response - SAT Response handler.
    * @return {boolean} True if the two bodies overlap, otherwise false.
    */
    overlap: function (body, response) {

        if ((this.type === Phaser.Physics.Arcade.RECT || this.type === Phaser.Physics.Arcade.POLYGON) && (body.type === Phaser.Physics.Arcade.RECT || body.type === Phaser.Physics.Arcade.POLYGON))
        {
            return SAT.testPolygonPolygon(this.polygon, body.polygon, response);
        }
        else if (this.type === Phaser.Physics.Arcade.CIRCLE && body.type === Phaser.Physics.Arcade.CIRCLE)
        {
            return SAT.testCircleCircle(this.shape, body.shape, response);
        }
        else if ((this.type === Phaser.Physics.Arcade.RECT || this.type === Phaser.Physics.Arcade.POLYGON) && body.type === Phaser.Physics.Arcade.CIRCLE)
        {
            return SAT.testPolygonCircle(this.polygon, body.shape, response);
        }
        else if (this.type === Phaser.Physics.Arcade.CIRCLE && (body.type === Phaser.Physics.Arcade.RECT || body.type === Phaser.Physics.Arcade.POLYGON))
        {
            return SAT.testCirclePolygon(this.shape, body.polygon, response);
        }

    },

    /**
    * This separates this Body from the given Body unless a customSeparateCallback is set.
    * It assumes they have already been overlap checked and the resulting overlap is stored in overlapX and overlapY.
    *
    * @method Phaser.Physics.Arcade#separate
    * @protected
    * @param {Phaser.Physics.Arcade.Body} body - The Body to be separated from this one.
    * @param {SAT.Response} response - SAT Response handler.
    * @return {boolean}
    */
    separate: function (body, response) {

        if (this.customSeparateCallback)
        {
            return this.customSeparateCallback.call(this.customSeparateContext, this, response);
        }

        // console.log(this.sprite.name, 'collided with', body.sprite.name, response);

        this._distances[0] = body.right - this.x;   // Distance of B to face on left side of A
        this._distances[1] = this.right - body.x;   // Distance of B to face on right side of A
        this._distances[2] = body.bottom - this.y;  // Distance of B to face on bottom side of A
        this._distances[3] = this.bottom - body.y;  // Distance of B to face on top side of A

        if (response.overlapN.x)
        {
            //  Which is smaller? Left or Right?
            if (this._distances[0] < this._distances[1])
            {
                // console.log(this.sprite.name, 'collided on the LEFT with', body.sprite.name, response);
                this.hitLeft(body, response);
            }
            else if (this._distances[1] < this._distances[0])
            {
                // console.log(this.sprite.name, 'collided on the RIGHT with', body.sprite.name, response);
                this.hitRight(body, response);
            }
        }
        else if (response.overlapN.y)
        {
            //  Which is smaller? Top or Bottom?
            if (this._distances[2] < this._distances[3])
            {
                // console.log(this.sprite.name, 'collided on the TOP with', body.sprite.name, response);
                this.hitTop(body, response);
            }
            else if (this._distances[3] < this._distances[2])
            {
                // console.log(this.sprite.name, 'collided on the BOTTOM with', body.sprite.name, response);
                this.hitBottom(body, response);
            }
        }

        this.game.physics.checkBounds(this);
        this.game.physics.checkBounds(body);

        return true;

    },

    /**
    * Process a collision with the left face of this Body.
    * Collision and separation can be further checked by setting a collideCallback.
    * This callback will be sent 4 parameters: The face of collision, this Body, the colliding Body and the SAT Response.
    * If the callback returns true then separation, rebounds and the touching flags will all be set.
    * If it returns false this will be skipped and must be handled manually.
    *
    * @method Phaser.Physics.Arcade#hitLeft
    * @protected
    * @param {Phaser.Physics.Arcade.Body} body - The Body that collided.
    * @param {SAT.Response} response - The SAT Response object containing the collision data.
    */
    hitLeft: function (body, response) {

        //  We know that Body is overlapping with This on the left hand side (deltaX < 0 = moving left, > 0 = moving right)
        // if (body.speed > 0 && (body.deltaX() <= 0 || (body.deltaX() > 0 && !this.checkCollision.left)))
        // {
        //     return;
        // }

        if (this.collideCallback && !this.collideCallback.call(this.collideCallbackContext, Phaser.LEFT, this, body, response))
        {
            return;
        }

        if (!this.moves || this.immovable || this.blocked.right || this.touching.right)
        {
            body.give(this, response);
        }
        else
        {
            if (body.immovable || body.blocked.left || body.touching.left)
            {
                //  We take the full separation
                this.take(body, response);
            }
            else
            {
                //  Share out the separation
                this.split(body, response);
            }
        }

        this.touching.left = true;
        body.touching.right = true;

    },

    /**
    * Process a collision with the right face of this Body.
    * Collision and separation can be further checked by setting a collideCallback.
    * This callback will be sent 4 parameters: The face of collision, this Body, the colliding Body and the SAT Response.
    * If the callback returns true then separation, rebounds and the touching flags will all be set.
    * If it returns false this will be skipped and must be handled manually.
    *
    * @method Phaser.Physics.Arcade#hitRight
    * @protected
    * @param {Phaser.Physics.Arcade.Body} body - The Body that collided.
    * @param {SAT.Response} response - The SAT Response object containing the collision data.
    */
    hitRight: function (body, response) {

        //  We know that Body is overlapping with This on the right hand side (deltaX < 0 = moving left, > 0 = moving right)
        // if (body.speed > 0 && (body.deltaX() >= 0 || (body.deltaX() < 0 && !this.checkCollision.right)))
        // {
        //     console.log('bail 1', body.deltaX());
        //     return;
        // }

        if (this.collideCallback && !this.collideCallback.call(this.collideCallbackContext, Phaser.RIGHT, this, body))
        {
            console.log('bail 2');
            return;
        }

        if (!this.moves || this.immovable || this.blocked.left || this.touching.left)
        {
            body.give(this, response);
        }
        else
        {
            if (body.immovable || body.blocked.right || body.touching.right)
            {
                //  We take the full separation
                this.take(body, response);
            }
            else
            {
                //  Share out the separation
                this.split(body, response);
            }
        }

        this.touching.right = true;
        body.touching.left = true;

    },

    /**
    * Process a collision with the top face of this Body.
    * Collision and separation can be further checked by setting a collideCallback.
    * This callback will be sent 4 parameters: The face of collision, this Body, the colliding Body and the SAT Response.
    * If the callback returns true then separation, rebounds and the touching flags will all be set.
    * If it returns false this will be skipped and must be handled manually.
    *
    * @method Phaser.Physics.Arcade#hitTop
    * @protected
    * @param {Phaser.Physics.Arcade.Body} body - The Body that collided.
    * @param {SAT.Response} response - The SAT Response object containing the collision data.
    */
    hitTop: function (body, response) {

        //  We know that Body is overlapping with This on the bottom side (deltaY < 0 = moving up, > 0 = moving down)
        // if (body.speed > 0 && (body.deltaY() <= 0 || (body.deltaY() > 0 && !this.checkCollision.up)))
        // if (body.speed > 0 && (body.deltaY() <= 0 || (body.deltaY() > 0 && !this.checkCollision.up)))
        // {
            // console.log('bail', body.sprite.name, body.deltaY());
            // return;
        // }

        if (this.collideCallback && !this.collideCallback.call(this.collideCallbackContext, Phaser.UP, this, body))
        {
            return;
        }

        if (!this.moves || this.immovable || this.blocked.down || this.touching.down)
        {
            body.give(this, response);
        }
        else
        {
            if (body.immovable || body.blocked.up || body.touching.up)
            {
                //  We take the full separation
                this.take(body, response);
            }
            else
            {
                //  Share out the separation
                this.split(body, response);
            }
        }

        this.touching.up = true;
        body.touching.down = true;

    },

    /**
    * Process a collision with the bottom face of this Body.
    * Collision and separation can be further checked by setting a collideCallback.
    * This callback will be sent 4 parameters: The face of collision, this Body, the colliding Body and the SAT Response.
    * If the callback returns true then separation, rebounds and the touching flags will all be set.
    * If it returns false this will be skipped and must be handled manually.
    *
    * @method Phaser.Physics.Arcade#hitBottom
    * @protected
    * @param {Phaser.Physics.Arcade.Body} body - The Body that collided.
    * @param {SAT.Response} response - The SAT Response object containing the collision data.
    */
    hitBottom: function (body, response) {

        //  We know that Body is overlapping with This on the bottom side (deltaY < 0 = moving up, > 0 = moving down)
        // if (body.speed > 0 && (body.deltaY() >= 0 || (body.deltaY() < 0 && !this.checkCollision.down)))
        // {
        //     return;
        // }

        if (this.collideCallback && !this.collideCallback.call(this.collideCallbackContext, Phaser.DOWN, this, body))
        {
            return;
        }

        if (!this.moves || this.immovable || this.blocked.up || this.touching.up)
        {
            body.give(this, response);
        }
        else
        {
            if (body.immovable || body.blocked.down || body.touching.down)
            {
                //  We take the full separation
                this.take(body, response);
            }
            else
            {
                //  Share out the separation
                this.split(body, response);
            }
        }

        this.touching.down = true;
        body.touching.up = true;

    },

    /**
    * Internal method. Integrates velocity, global gravity and the delta timer.
    *
    * @method Phaser.Physics.Arcade#integrateVelocity
    * @protected
    */
    integrateVelocity: function () {

        this._temp = this.game.physics.updateMotion(this);
        this._dx = this.game.time.physicsElapsed * (this.velocity.x + this._temp.x / 2);
        this._dy = this.game.time.physicsElapsed * (this.velocity.y + this._temp.y / 2);

        if (this.sprite.debug)
        {
            // console.log('integrateVelocity TEMP:', this._temp.x, this._temp.y);
        }

        //  positive = RIGHT / DOWN
        //  negative = LEFT / UP

        if ((this._dx < 0 && !this.blocked.left && !this.touching.left) || (this._dx > 0 && !this.blocked.right && !this.touching.right))
        {
            this.x += this._dx;
            this.velocity.x += this._temp.x;
            if (this.sprite.debug)
            {
                // console.log('integrateVelocity x added', this._dx, this.x);
            }
        }
        else
        {
            if (this.sprite.debug)
            {
                // console.log('integrateVelocity x failed or zero, blocked left/right', this._dx);
            }
        }

        if ((this._dy < 0 && !this.blocked.up && !this.touching.up) || (this._dy > 0 && !this.blocked.down && !this.touching.down))
        {
            this.y += this._dy;
            this.velocity.y += this._temp.y;
            if (this.sprite.debug)
            {
                // console.log('integrateVelocity y added', this._dy, this.y);
            }
        }
        else
        {
            if (this.sprite.debug)
            {
                // console.log('integrateVelocity y failed or zero, blocked up/down', this._dy);
            }
        }

        if (this.velocity.x > this.maxVelocity.x)
        {
            this.velocity.x = this.maxVelocity.x;
        }
        else if (this.velocity.x < -this.maxVelocity.x)
        {
            this.velocity.x = -this.maxVelocity.x;
        }

        if (this.velocity.y > this.maxVelocity.y)
        {
            this.velocity.y = this.maxVelocity.y;
        }
        else if (this.velocity.y < -this.maxVelocity.y)
        {
            this.velocity.y = -this.maxVelocity.y;
        }

    },

    /**
    * Internal method. This is called directly before the sprites are sent to the renderer and after the update function has finished.
    *
    * @method Phaser.Physics.Arcade#postUpdate
    * @protected
    */
    postUpdate: function () {

        if (this.moves)
        {
            this.reboundCheck(true, true, true);

            this.game.physics.checkBounds(this);

            if (this.deltaX() < 0)
            {
                this.facing = Phaser.LEFT;
            }
            else if (this.deltaX() > 0)
            {
                this.facing = Phaser.RIGHT;
            }

            if (this.deltaY() < 0)
            {
                this.facing = Phaser.UP;
            }
            else if (this.deltaY() > 0)
            {
                this.facing = Phaser.DOWN;
            }

if (this.sprite.debug)
{
    // console.log('Body postUpdate x:', this.x, 'y:', this.y, 'left:', this.left, 'right:', this.right, 'WAS', this.preX, this.preY);
    // console.log('Body postUpdate blocked:', this.blocked, this.blockFlags);
    // console.log('Body postUpdate velocity:', this.velocity.x, this.velocity.y);
    // console.log('Body postUpdate Sprite:', this.sprite.x, this.sprite.y, 'cached', this.sprite._cache.x, this.sprite._cache.y);
    console.log('Body postUpdate Rotation:', this.rotation);
}

            if (this.deltaX() !== 0 || this.deltaY() !== 0)
            {
                this.sprite.worldTransform[2] = this.sprite.x = (this.x + (this.sprite.anchor.x * this.sprite.width) - this.offset.x);
                this.sprite.worldTransform[5] = this.sprite.y = (this.y + (this.sprite.anchor.y * this.sprite.height) - this.offset.y);
            }

            if (this.allowRotation && this.deltaZ() !== 0)
            {
                // this.sprite.angle += this.deltaZ();
            }

            if (this.sprite.scale.x !== this._sx || this.sprite.scale.y !== this._sy)
            {
                this.updateScale();
            }

        }

    },

    /**
    * Resets the Body motion values: velocity, acceleration, angularVelocity and angularAcceleration.
    * Also resets the forces to defaults: gravity, bounce, minVelocity,maxVelocity, angularDrag, maxAngular, mass, friction and checkCollision if 'full' specified.
    *
    * @method Phaser.Physics.Arcade#reset
    * @param {boolean} [full=false] - A full reset clears down settings you may have set, such as gravity, bounce and drag. A non-full reset just clears motion values.
    */
    reset: function (full) {

        if (typeof full === 'undefined') { full = false; }

        if (full)
        {
            this.gravity.setTo(0, 0);
            this.bounce.setTo(0, 0);
            this.minVelocity.setTo(5, 5);
            this.maxVelocity.setTo(1000, 1000);
            this.angularDrag = 0;
            this.maxAngular = 1000;
            this.mass = 1;
            this.friction = 0.0;
            this.checkCollision = { none: false, any: true, up: true, down: true, left: true, right: true };
        }

        this.velocity.setTo(0, 0);
        this.acceleration.setTo(0, 0);
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.blocked = { x: 0, y: 0, up: false, down: false, left: false, right: false };
        this.x = (this.sprite.world.x - (this.sprite.anchor.x * this.sprite.width)) + this.offset.x;
        this.y = (this.sprite.world.y - (this.sprite.anchor.y * this.sprite.height)) + this.offset.y;
        this.updateBounds();

    },

    /**
    * Returns the delta x value. The difference between Body.x now and in the previous step.
    *
    * @method Phaser.Physics.Arcade.Body#deltaX
    * @return {number} The delta value. Positive if the motion was to the right, negative if to the left.
    */
    deltaX: function () {

        if (this.moves)
        {
            return this.x - this.preX;
        }
        else
        {
            return this.sprite.deltaX;
        }

    },

    /**
    * Returns the delta y value. The difference between Body.y now and in the previous step.
    *
    * @method Phaser.Physics.Arcade.Body#deltaY
    * @return {number} The delta value. Positive if the motion was downwards, negative if upwards.
    */
    deltaY: function () {

        if (this.moves)
        {
            return this.y - this.preY;
        }
        else
        {
            return this.sprite.deltaY;
        }

    },

    /**
    * Returns the delta z value. The difference between Body.rotation now and in the previous step.
    *
    * @method Phaser.Physics.Arcade.Body#deltaZ
    * @return {number} The delta value.
    */
    deltaZ: function () {
        return this.rotation - this.preRotation;
    }

};

Phaser.Physics.Arcade.Body.prototype.constructor = Phaser.Physics.Arcade.Body;

/**
* @name Phaser.Physics.Arcade.Body#x
* @property {number} x
*/
Object.defineProperty(Phaser.Physics.Arcade.Body.prototype, "x", {
    
    /**
    * @method x
    * @return {number}
    */
    get: function () {
        
        if (this.type === Phaser.Physics.Arcade.CIRCLE)
        {
            return this.shape.pos.x;
        }
        else
        {
            return this.polygon.pos.x;
        }

    },

    /**
    * @method x
    * @param {number} value
    */
    set: function (value) {

        if (this.type === Phaser.Physics.Arcade.CIRCLE)
        {
            this.shape.pos.x = value;
        }
        else
        {
            this.polygon.pos.x = value;
        }

        // this.updateBounds();

    }

});

/**
* @name Phaser.Physics.Arcade.Body#y
* @property {number} y
*/
Object.defineProperty(Phaser.Physics.Arcade.Body.prototype, "y", {
    
    /**
    * @method y
    * @return {number}
    */
    get: function () {
        
        if (this.type === Phaser.Physics.Arcade.CIRCLE)
        {
            return this.shape.pos.y;
        }
        else
        {
            return this.polygon.pos.y;
        }

    },

    /**
    * @method y
    * @param {number} value
    */
    set: function (value) {

        if (this.type === Phaser.Physics.Arcade.CIRCLE)
        {
            this.shape.pos.y = value;
        }
        else
        {
            this.polygon.pos.y = value;
        }

        // this.updateBounds();

    }

});
