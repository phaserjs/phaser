/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
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
    * @property {number} x - The x position of the physics body.
    * @readonly
    */
    this.x = sprite.x;

    /**
    * @property {number} y - The y position of the physics body.
    * @readonly
    */
    this.y = sprite.y;

    /**
    * @property {number} preX - The previous x position of the physics body.
    * @readonly
    */
    this.preX = sprite.x;

    /**
    * @property {number} preY - The previous y position of the physics body.
    * @readonly
    */
    this.preY = sprite.y;

    /**
    * @property {number} preRotation - The previous rotation of the physics body.
    * @readonly
    */
    this.preRotation = sprite.angle;

    /**
    * @property {number} screenX - The x position of the physics body translated to screen space.
    * @readonly
    */
    this.screenX = sprite.x;

    /**
    * @property {number} screenY - The y position of the physics body translated to screen space.
    * @readonly
    */
    this.screenY = sprite.y;

    /**
    * @property {number} sourceWidth - The un-scaled original size.
    * @readonly
    */
    this.sourceWidth = sprite.currentFrame.sourceSizeW;

    /**
    * @property {number} sourceHeight - The un-scaled original size.
    * @readonly
    */
    this.sourceHeight = sprite.currentFrame.sourceSizeH;

    /**
    * @property {number} width - The calculated width of the physics body.
    */
    this.width = sprite.currentFrame.sourceSizeW;

    /**
    * @property .numInternal ID cache
    */
    this.height = sprite.currentFrame.sourceSizeH;

    /**
    * @property {number} halfWidth - The calculated width / 2 of the physics body.
    */
    this.halfWidth = Math.floor(sprite.currentFrame.sourceSizeW / 2);

    /**
    * @property {number} halfHeight - The calculated height / 2 of the physics body.
    */
    this.halfHeight = Math.floor(sprite.currentFrame.sourceSizeH / 2);

    /**
    * @property {Phaser.Point} center - The center coordinate of the Physics Body.
    */
    this.center = new Phaser.Point(this.x + this.halfWidth, this.y + this.halfHeight);

    /**
    * @property {Phaser.Point} motionVelocity - The data from the updateMotion function.
    */
    this.motionVelocity = new Phaser.Point();

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
    * @property {number} angle - The angle of the Body in radians.
    */
    this.angle = 0;

    /**
    * @property {number} minBounceVelocity - Optional minimum bounce velocity.
    */
    this.minBounceVelocity = 0.1;

    /**
    * @property {Phaser.Point} gravity - The gravity applied to the motion of the Body. This works in addition to any gravity set on the world.
    */
    this.gravity = new Phaser.Point();

    /**
    * @property {Phaser.Point} bounce - The elasticitiy of the Body when colliding. bounce.x/y = 1 means full rebound, bounce.x/y = 0.5 means 50% rebound velocity.
    */
    this.bounce = new Phaser.Point();

    /**
    * @property {Phaser.Point} minVelocity - When a body rebounds off another the minVelocity is checked, if the new velocity is lower than the minVelocity the body is stopped.
    * @default
    */
    this.minVelocity = new Phaser.Point(10, 10);

    /**
    * @property {Phaser.Point} maxVelocity - The maximum velocity that the Body can reach.
    * @default
    */
    this.maxVelocity = new Phaser.Point(2000, 2000);

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
    * @property {boolean} moves - Set to true to allow the Physics system to move this Body, or false to move it manually.
    * @default
    */
    this.moves = true;

    /**
    * @property {number} rotation - The amount the parent Sprite is rotated. Note: You cannot rotate an AABB.
    * @default
    */
    this.rotation = 0;

    /**
    * @property {boolean} allowRotation - Allow angular rotation? This will cause the Sprite to be rotated via angularVelocity, etc. Note that the AABB remains un-rotated.
    * @default
    */
    this.allowRotation = true;

    /**
    * @property {boolean} allowGravity - Allow this Body to be influenced by the global Gravity value? Note: It will always be influenced by the local gravity value.
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
    * @property {number} friction - The amount of friction this body experiences during motion.
    * @default
    */
    this.friction = 0.1;

    /**
    * A Body can be set to collide against the World bounds automatically and rebound back into the World if this is set to true. Otherwise it will leave the World.
    * @property {boolean} collideWorldBounds - Should the Body collide with the World bounds?
    */
    this.collideWorldBounds = false;

    /**
    * This object is populated with boolean values when the Body collides with the World bounds or a Tile.
    * For example if blocked.up is true then the Body cannot move up.
    * @property {object} blocked - An object containing on which faces this Body is blocked from moving, if any.
    */
    this.blocked = { up: false, down: false, left: false, right: false };

    /**
    * @property {Phaser.Point} blockedPoint - A Point object holding the blocked penetration distance.
    */
    this.blockedPoint = new Phaser.Point(0, 0);

    /**
    * @property {Phaser.Physics.Arcade.RECT|Phaser.Physics.Arcade.CIRCLE} type - The type of SAT Shape.
    */
    this.type = Phaser.Physics.Arcade.RECT;

    /**
    * @property {SAT.Box|SAT.Circle|SAT.Polygon} shape - The SAT Collision shape.
    */
    this.shape = new SAT.Box(new SAT.Vector(this.x, this.y), this.width, this.height);

    /**
    * @property {SAT.Polygon} polygons - The SAT Polygons, as derived from the Shape.
    * @private
    */
    this.polygons = this.shape.toPolygon();

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

    this._debug = 0;

};

Phaser.Physics.Arcade.Body.prototype = {

    setCircle: function (radius) {

        this.shape = new SAT.Circle(new SAT.Vector(this.x, this.y), radius);
        this.polygons = null;
        this.type = Phaser.Physics.Arcade.CIRCLE;

    },

    setBox: function () {

        this.shape = new SAT.Box(new SAT.Vector(this.x, this.y), this.width, this.height);
        this.polygons = this.shape.toPolygon();
        this.type = Phaser.Physics.Arcade.RECT;

    },

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade#updateBounds
    * @protected
    */
    updateBounds: function (centerX, centerY, scaleX, scaleY) {

        if (scaleX != this._sx || scaleY != this._sy)
        {
            this.width = this.sourceWidth * scaleX;
            this.height = this.sourceHeight * scaleY;
            this.halfWidth = Math.floor(this.width / 2);
            this.halfHeight = Math.floor(this.height / 2);

            if (this.polygons)
            {
                this.polygons.scale(scaleX / this._sx, scaleY / this._sy);
            }

            this._sx = scaleX;
            this._sy = scaleY;
            this.center.setTo(this.x + this.halfWidth, this.y + this.halfHeight);
        }

    },

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade#preUpdate
    * @protected
    */
    preUpdate: function () {

        this.screenX = (this.sprite.worldTransform[2] - (this.sprite.anchor.x * this.width)) + this.offset.x;
        this.screenY = (this.sprite.worldTransform[5] - (this.sprite.anchor.y * this.height)) + this.offset.y;

        this.preX = (this.sprite.world.x - (this.sprite.anchor.x * this.width)) + this.offset.x;
        this.preY = (this.sprite.world.y - (this.sprite.anchor.y * this.height)) + this.offset.y;
        this.preRotation = this.sprite.angle;

        this.blocked.up = false;
        this.blocked.down = false;
        this.blocked.left = false;
        this.blocked.right = false;

        this.touching.none = true;
        this.touching.up = false;
        this.touching.down = false;
        this.touching.left = false;
        this.touching.right = false;

        this.x = this.preX;
        this.y = this.preY;
        this.rotation = this.preRotation;

        this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        this.angle = Math.atan2(this.velocity.y, this.velocity.x);

        if (this.moves)
        {
            if (this.collideWorldBounds)
            {
                this.checkWorldBounds();
            }

            this.game.physics.updateMotion(this);

            this.applyMotion();
        }

        this.syncPosition();

    },

    /**
    * Internal method used to check the Body against the World Bounds.
    *
    * @method Phaser.Physics.Arcade#checkWorldBounds
    * @protected
    */
    checkWorldBounds: function () {

        this.blockedPoint.setTo(0, 0);

        if (this.x <= this.game.world.bounds.x)
        {
            this.blockedPoint.x = this.game.world.bounds.x - this.x;
            this.blocked.left = true;
            this.touching.left = true;
        }
        else if (this.right >= this.game.world.bounds.right)
        {
            this.blockedPoint.x = this.right - this.game.world.bounds.right;
            this.blocked.right = true;
            this.touching.right = true;
        }

        if (this.y <= this.game.world.bounds.y)
        {
            this.blockedPoint.y =  this.game.world.bounds.y - this.y;
            this.blocked.up = true;
            this.touching.up = true;
        }
        else if (this.bottom >= this.game.world.bounds.bottom)
        {
            this.blockedPoint.y = this.bottom - this.game.world.bounds.bottom;
            this.blocked.down = true;
            this.touching.down = true;
        }

    },

    /**
    * Internal method used to check the Body against the World Bounds.
    *
    * @method Phaser.Physics.Arcade#adjustWorldBounds
    * @protected
    */
    adjustWorldBounds: function () {

        if (this.x < this.game.world.bounds.x)
        {
            this.x += this.game.world.bounds.x - this.x;
            this.preX += this.game.world.bounds.x - this.x;
        }
        else if (this.right > this.game.world.bounds.right)
        {
            this.x -= this.right - this.game.world.bounds.right;
            this.preX -= this.right - this.game.world.bounds.right;
        }

        if (this.y < this.game.world.bounds.y)
        {
            this.y += this.game.world.bounds.y - this.y;
            this.preY += this.game.world.bounds.y - this.y;
        }
        else if (this.bottom > this.game.world.bounds.bottom)
        {
            this.y -= this.bottom - this.game.world.bounds.bottom;
            this.preY -= this.bottom - this.game.world.bounds.bottom;
        }

    },

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade#applyMotion
    * @protected
    */
    applyMotion: function () {

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

            this.velocity.x = Math.cos(this.angle) * this.speed;
            this.velocity.y = Math.sin(this.angle) * this.speed;
        }

        //  overlapX/Y values at this point will be penetration into the bounds and DELTA WILL BE ZERO
        if (this.blocked.left && this.blockedPoint.x > 0)
        {
            //  Separate
            this.x += this.blockedPoint.x;
            this.velocity.x *= -this.bounce.x;
            this.reboundCheck(true, false);

            this._dx = this.game.time.physicsElapsed * (this.velocity.x + this.motionVelocity.x / 2);

            // if (this._dx > this.minBounceVelocity || this.getTotalGravityX() > 0)
            // {
                this.x += this._dx;
                this.velocity.x += this.motionVelocity.x;
            // }
            // else
            // {
            //     this.preX = this.x;
            //     this.velocity.x = 0;
            // }
        }
        else if (this.blocked.right && this.blockedPoint.x > 0)
        {
            //  Separate
            this.x -= this.blockedPoint.x;
            this.velocity.x *= -this.bounce.x;
            this.reboundCheck(true, false);

            this._dx = this.game.time.physicsElapsed * (this.velocity.x + this.motionVelocity.x / 2);

            // if (this._dx < -this.minBounceVelocity || this.getTotalGravityX() < 0)
            // {
                this.x += this._dx;
                this.velocity.x += this.motionVelocity.x;
            // }
            // else
            // {
            //     this.preX = this.x;
            //     this.velocity.x = 0;
            // }
        }
        else
        {
            this.x += this.game.time.physicsElapsed * (this.velocity.x + this.motionVelocity.x / 2);
            this.velocity.x += this.motionVelocity.x;
        }

        //  overlapX/Y values at this point will be penetration into the bounds and DELTA WILL BE ZERO
        if (this.blocked.up && this.blockedPoint.y > 0)
        {
            //  Separate
            this.y += this.blockedPoint.y;
            this.velocity.y *= -this.bounce.y;
            this.reboundCheck(false, true);

            this._dy = this.game.time.physicsElapsed * (this.velocity.y + this.motionVelocity.y / 2);

            // if (this._dy > this.minBounceVelocity || this.getTotalGravityY() > 0)
            // {
                this.y += this._dy;
                this.velocity.y += this.motionVelocity.y;
            // }
            // else
            // {
            //     this.preY = this.y;
            //     this.velocity.y = 0;
            // }
        }
        else if (this.blocked.down && this.blockedPoint.y > 0)
        {
            //  Separate
            this.y -= this.blockedPoint.y;
            this.velocity.y *= -this.bounce.y;
            this.reboundCheck(false, true);

            this._dy = this.game.time.physicsElapsed * (this.velocity.y + this.motionVelocity.y / 2);

            // if (this._dy < -this.minBounceVelocity || this.getTotalGravityY() < 0)
            // {
                this.y += this._dy;
                this.velocity.y += this.motionVelocity.y;
            // }
            // else
            // {
            //     this.preY = this.y;
            //     this.velocity.y = 0;
            // }
        }
        else
        {
            this.y += this.game.time.physicsElapsed * (this.velocity.y + this.motionVelocity.y / 2);
            this.velocity.y += this.motionVelocity.y;
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

        this.syncPosition();

    },

    /**
    * Check if we're below minVelocity and gravity isn't trying to drag us in the opposite direction.
    *
    * @method Phaser.Physics.Arcade#reboundCheck
    * @protected
    * @param {boolean} x - Check the X axis?
    * @param {boolean} y - Check the Y axis?
    */
    reboundCheck: function (x, y) {

        if (x)
        {
            var gx = this.getTotalGravityX();
    
            if (Math.abs(this.velocity.x) < this.minVelocity.x && (this.blocked.left && gx < 0 || this.blocked.right && gx > 0))
            {
                this.velocity.x = 0;
            }
        }

        if (y)
        {
            var gy = this.getTotalGravityY();
    
            if (Math.abs(this.velocity.y) < this.minVelocity.y && (this.blocked.up && gy < 0 || this.blocked.down && gy > 0))
            {
                this.velocity.y = 0;
            }
        }

    },

    /**
    * Gets the total gravity to be applied on the X axis.
    *
    * @method Phaser.Physics.Arcade#getTotalGravityX
    * @protected
    * @return {number} The total gravity to be applied on the X axis.
    */
    getTotalGravityX: function () {

        if (this.allowGravity)
        {
            return this.gravity.x + this.game.physics.gravity.x;
        }
        else
        {
            return this.gravity.x;
        }

    },

    /**
    * Gets the total gravity to be applied on the Y axis.
    *
    * @method Phaser.Physics.Arcade#getTotalGravityY
    * @protected
    * @return {number} The total gravity to be applied on the Y axis.
    */
    getTotalGravityY: function () {

        if (this.allowGravity)
        {
            return this.gravity.y + this.game.physics.gravity.y;
        }
        else
        {
            return this.gravity.y;
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

        this.reboundCheck(true, true);
        body.reboundCheck(true, true);

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
        this.reboundCheck(true, true);

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

        if (this.type === Phaser.Physics.Arcade.RECT && body.type === Phaser.Physics.Arcade.RECT)
        {
            return SAT.testPolygonPolygon(this.polygons, body.polygons, response);
        }
        else if (this.type === Phaser.Physics.Arcade.CIRCLE && body.type === Phaser.Physics.Arcade.CIRCLE)
        {
            return SAT.testCircleCircle(this.shape, body.shape, response);
        }
        else if (this.type === Phaser.Physics.Arcade.RECT && body.type === Phaser.Physics.Arcade.CIRCLE)
        {
            return SAT.testPolygonCircle(this.polygons, body.shape, response);
        }
        else if (this.type === Phaser.Physics.Arcade.CIRCLE && body.type === Phaser.Physics.Arcade.RECT)
        {
            return SAT.testCirclePolygon(this.shape, body.polygons, response);
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

        this.syncPosition();
        body.syncPosition();

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
        if (body.speed > 0 && (body.deltaX() <= 0 || (body.deltaX() > 0 && !this.checkCollision.left)))
        {
            return;
        }

        if (this.collideCallback && !this.collideCallback.call(this.collideCallbackContext, Phaser.LEFT, this, body, response))
        {
            return;
        }

        //  This body isn't moving horizontally, so it was hit by something moving right
        if (this.immovable || this.blocked.right)
        {
            body.give(this, response);
        }
        else
        {
            if (body.immovable || body.blocked.left)
            {
                //  We take the full separation as what hit it isn't moveable
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

        if (this.checkWorldBounds && this.right >= this.game.world.bounds.right)
        {
            this.blocked.right = true;
            this.x -= this.right - this.game.world.bounds.right;
        }

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
        if (body.speed > 0 && (body.deltaX() >= 0 || (body.deltaX() < 0 && !this.checkCollision.right)))
        {
            return;
        }

        if (this.collideCallback && !this.collideCallback.call(this.collideCallbackContext, Phaser.RIGHT, this, body))
        {
            return;
        }

        //  This body isn't moving horizontally, so it was hit by something moving left
        if (this.immovable || this.blocked.left)
        {
            body.give(this, response);
        }
        else
        {
            if (body.immovable || body.blocked.right)
            {
                //  We take the full separation as what hit it isn't moveable
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

        if (this.checkWorldBounds && this.x <= this.game.world.bounds.x)
        {
            this.blocked.left = true;
            this.x += this.game.world.bounds.x - this.x;
        }

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
        if (body.speed > 0 && (body.deltaY() <= 0 || (body.deltaY() > 0 && !this.checkCollision.up)))
        {
            return;
        }

        if (this.collideCallback && !this.collideCallback.call(this.collideCallbackContext, Phaser.UP, this, body))
        {
            return;
        }

        //  This body isn't moving vertically, so it was hit by something moving down
        if (this.immovable || this.blocked.down)
        {
            body.give(this, response);
        }
        else
        {
            if (body.immovable || body.blocked.up)
            {
                //  We take the full separation as what hit it isn't moveable
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

        if (this.checkWorldBounds && this.bottom >= this.game.world.bounds.bottom)
        {
            this.blocked.down = true;
            this.y -= this.bottom - this.game.world.bounds.bottom;
        }

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
        if (body.speed > 0 && (body.deltaY() >= 0 || (body.deltaY() < 0 && !this.checkCollision.down)))
        {
            return;
        }

        if (this.collideCallback && !this.collideCallback.call(this.collideCallbackContext, Phaser.DOWN, this, body))
        {
            return;
        }

        //  This body isn't moving vertically, so it was hit by something moving up
        if (this.immovable || this.blocked.up)
        {
            body.give(this, response);
        }
        else
        {
            if (body.immovable || body.blocked.down)
            {
                //  We take the full separation as what hit it isn't moveable
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

        if (this.checkWorldBounds && this.y <= this.game.world.bounds.y)
        {
            this.blocked.up = true;
            this.y += this.game.world.bounds.y - this.y;
        }

    },

    /**
    * Internal method that syncs the Body coordinates with the SAT shape and polygon positions.
    *
    * @method Phaser.Physics.Arcade#syncPosition
    * @protected
    */
    syncPosition: function () {

        this.shape.pos.x = this.x;
        this.shape.pos.y = this.y;

        if (this.polygons)
        {
            this.polygons.pos.x = this.x;
            this.polygons.pos.y = this.y;
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
            this.adjustWorldBounds();

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

            if ((this.deltaX() < 0 && !this.blocked.left) || (this.deltaX() > 0 && !this.blocked.right))
            {
                this.sprite.x += this.deltaX();
                this.sprite.worldTransform[2] += this.deltaX();
            }

            if ((this.deltaY() < 0 && !this.blocked.up) || (this.deltaY() > 0 && !this.blocked.down))
            {
                this.sprite.y += this.deltaY();
                this.sprite.worldTransform[5] += this.deltaY();
            }

            this.center.setTo(this.x + this.halfWidth, this.y + this.halfHeight);

            if (this.allowRotation)
            {
                this.sprite.angle += this.deltaZ();
            }
        }

    },

    /**
    * You can modify the size of the physics Body to be any dimension you need.
    * So it could be smaller or larger than the parent Sprite. You can also control the x and y offset, which
    * is the position of the Body relative to the top-left of the Sprite.
    *
    * @method Phaser.Physics.Arcade#setSize
    * @param {number} width - The width of the Body.
    * @param {number} height - The height of the Body.
    * @param {number} offsetX - The X offset of the Body from the Sprite position.
    * @param {number} offsetY - The Y offset of the Body from the Sprite position.
    */
    setSize: function (width, height, offsetX, offsetY) {

        offsetX = offsetX || this.offset.x;
        offsetY = offsetY || this.offset.y;

        this.sourceWidth = width;
        this.sourceHeight = height;
        this.width = this.sourceWidth * this._sx;
        this.height = this.sourceHeight * this._sy;
        this.halfWidth = Math.floor(this.width / 2);
        this.halfHeight = Math.floor(this.height / 2);
        this.offset.setTo(offsetX, offsetY);
        this.center.setTo(this.x + this.halfWidth, this.y + this.halfHeight);

        if (this.type === Phaser.Physics.Arcade.RECT)
        {
            this.setBox();
        }
        else
        {
            this.setCircle();
        }

    },

    /**
    * Resets all Body values (velocity, acceleration, rotation, etc)
    *
    * @method Phaser.Physics.Arcade#reset
    */
    reset: function () {

        this.velocity.setTo(0, 0);
        this.acceleration.setTo(0, 0);

        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.preX = (this.sprite.world.x - (this.sprite.anchor.x * this.width)) + this.offset.x;
        this.preY = (this.sprite.world.y - (this.sprite.anchor.y * this.height)) + this.offset.y;
        this.preRotation = this.sprite.angle;

        this.x = this.preX;
        this.y = this.preY;
        this.rotation = this.preRotation;
        
        this.shape.pos.x = this.x;
        this.shape.pos.y = this.y;

        if (this.polygons)
        {
            this.polygons.pos.x = this.x;
            this.polygons.pos.y = this.y;
        }

        this.center.setTo(this.x + this.halfWidth, this.y + this.halfHeight);

    },

    /**
    * Returns the absolute delta x value.
    *
    * @method Phaser.Physics.Arcade.Body#deltaAbsX
    * @return {number} The absolute delta value.
    */
    deltaAbsX: function () {
        return (this.deltaX() > 0 ? this.deltaX() : -this.deltaX());
    },

    /**
    * Returns the absolute delta y value.
    *
    * @method Phaser.Physics.Arcade.Body#deltaAbsY
    * @return {number} The absolute delta value.
    */
    deltaAbsY: function () {
        return (this.deltaY() > 0 ? this.deltaY() : -this.deltaY());
    },

    /**
    * Returns the delta x value. The difference between Body.x now and in the previous step.
    *
    * @method Phaser.Physics.Arcade.Body#deltaX
    * @return {number} The delta value. Positive if the motion was to the right, negative if to the left.
    */
    deltaX: function () {
        return this.x - this.preX;
    },

    /**
    * Returns the delta y value. The difference between Body.y now and in the previous step.
    *
    * @method Phaser.Physics.Arcade.Body#deltaY
    * @return {number} The delta value. Positive if the motion was downwards, negative if upwards.
    */
    deltaY: function () {
        return this.y - this.preY;
    },

    deltaZ: function () {
        return this.rotation - this.preRotation;
    }

};

Phaser.Physics.Arcade.Body.prototype.constructor = Phaser.Physics.Arcade.Body;

/**
* @name Phaser.Physics.Arcade.Body#bottom
* @property {number} bottom - The bottom value of this Body (same as Body.y + Body.height)
*/
Object.defineProperty(Phaser.Physics.Arcade.Body.prototype, "bottom", {
    
    /**
    * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
    * @method bottom
    * @return {number}
    */
    get: function () {
        return this.y + this.height;
    },

    /**
    * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
    * @method bottom
    * @param {number} value
    */
    set: function (value) {

        if (value <= this.y)
        {
            this.height = 0;
        }
        else
        {
            this.height = (this.y - value);
        }
        
    }

});

/**
* @name Phaser.Physics.Arcade.Body#right
* @property {number} right - The right value of this Body (same as Body.x + Body.width)
*/
Object.defineProperty(Phaser.Physics.Arcade.Body.prototype, "right", {
    
    /**
    * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
    * However it does affect the width property.
    * @method right
    * @return {number}
    */
    get: function () {
        return this.x + this.width;
    },

    /**
    * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
    * However it does affect the width property.
    * @method right
    * @param {number} value
    */
    set: function (value) {

        if (value <= this.x)
        {
            this.width = 0;
        }
        else
        {
            this.width = this.x + value;
        }

    }

});
