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
    * @property {number} minBounceVelocity - The minimum bounce velocity (could just be the bounce value?).
    */
    this.minBounceVelocity = 0.5;

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
    * Set the allowCollision properties to control which directions collision is processed for this Body.
    * For example allowCollision.up = false means it won't collide when the collision happened while moving up.
    * @property {object} allowCollision - An object containing allowed collision.
    */
    this.allowCollision = { none: false, any: true, up: true, down: true, left: true, right: true };

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
    * When this body collides with another, the amount of overlap is stored here.
    * @property {number} overlapX - The amount of horizontal overlap during the collision.
    */
    this.overlapX = 0;

    /**
    * When this body collides with another, the amount of overlap is stored here.
    * @property {number} overlapY - The amount of vertical overlap during the collision.
    */
    this.overlapY = 0;

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
    * @property {number} _newVelocity1 - Internal cache var.
    * @private
    */
    this._newVelocity1 = 0;

    /**
    * @property {number} _newVelocity2 - Internal cache var.
    * @private
    */
    this._newVelocity2 = 0;

    /**
    * @property {number} _average - Internal cache var.
    * @private
    */
    this._average = 0;

    this._debug = 0;

};

Phaser.Physics.Arcade.Body.prototype = {

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

    },

    /**
    * Internal method used to check the Body against the World Bounds.
    *
    * @method Phaser.Physics.Arcade#checkWorldBounds
    * @protected
    */
    checkWorldBounds: function () {

        this.blockedPoint.setTo(0, 0);

        if (this.x < this.game.world.bounds.x)
        {
            this.blockedPoint.x = this.game.world.bounds.x - this.x;
            this.blocked.left = true;
            this.touching.left = true;
        }
        else if (this.right > this.game.world.bounds.right)
        {
            this.blockedPoint.x = this.right - this.game.world.bounds.right;
            this.blocked.right = true;
            this.touching.right = true;
        }

        if (this.y < this.game.world.bounds.y)
        {
            this.blockedPoint.y =  this.game.world.bounds.y - this.y;
            this.blocked.up = true;
            this.touching.up = true;
        }
        else if (this.bottom > this.game.world.bounds.bottom)
        {
            this.blockedPoint.y = this.bottom - this.game.world.bounds.bottom;
            this.blocked.down = true;
            this.touching.down = true;
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

            if (this._dx > this.minBounceVelocity || this.getTotalGravityX() > 0)
            {
                this.x += this._dx;
                this.velocity.x += this.motionVelocity.x;
            }
            else
            {
                this.preX = this.x;
                this.velocity.x = 0;
            }
        }
        else if (this.blocked.right && this.blockedPoint.x > 0)
        {
            //  Separate
            this.x -= this.blockedPoint.x;
            this.velocity.x *= -this.bounce.x;
            this.reboundCheck(true, false);

            this._dx = this.game.time.physicsElapsed * (this.velocity.x + this.motionVelocity.x / 2);

            if (this._dx < -this.minBounceVelocity || this.getTotalGravityX() < 0)
            {
                this.x += this._dx;
                this.velocity.x += this.motionVelocity.x;
            }
            else
            {
                this.preX = this.x;
                this.velocity.x = 0;
            }
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

            if (this._dy > this.minBounceVelocity || this.getTotalGravityY() > 0)
            {
                this.y += this._dy;
                this.velocity.y += this.motionVelocity.y;
            }
            else
            {
                this.preY = this.y;
                this.velocity.y = 0;
            }
        }
        else if (this.blocked.down && this.blockedPoint.y > 0)
        {
            //  Separate
            this.y -= this.blockedPoint.y;
            this.velocity.y *= -this.bounce.y;
            this.reboundCheck(false, true);

            this._dy = this.game.time.physicsElapsed * (this.velocity.y + this.motionVelocity.y / 2);

            if (this._dy < -this.minBounceVelocity || this.getTotalGravityY() < 0)
            {
                this.y += this._dy;
                this.velocity.y += this.motionVelocity.y;
            }
            else
            {
                this.preY = this.y;
                this.velocity.y = 0;
            }
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

    },

    /**
    * Checks for an overlap between this Body and the given Body, taking into account the allowCollision flags on both bodies.
    * If an overlap occurs the Body.touching flags are set and the results are stored in overlapX and overlapY.
    *
    * @method Phaser.Physics.Arcade#overlap
    * @param {Phaser.Physics.Arcade.Body} body - The Body that collided.
    * @return {boolean} True if the two bodies overlap, otherwise false.
    */
    overlap: function (body) {

        this.overlapX = 0;
        this.overlapY = 0;

        if (this.x < body.x && this.allowCollision.right && body.allowCollision.left)
        {
            //  Negative = body touched this one on the right face
            this.overlapX = body.x - this.right;
            this.touching.right = true;
        }
        else if (this.x > body.x && this.allowCollision.left && body.allowCollision.right)
        {
            //  Positive means body touched this one on the left face
            this.overlapX = body.right - this.x;
            this.touching.left = true;
        }

        if (this.y < body.y && this.allowCollision.down && body.allowCollision.up)
        {
            //  Negative = body touched this one on the bottom face
            this.overlapY = body.y - this.bottom;
            this.touching.down = true;
        }
        else if (this.y > body.y && this.allowCollision.up && body.allowCollision.down)
        {
            //  Positive means body touched this one on the top face
            this.overlapY = body.bottom - this.y;
            this.touching.up = true;
        }

        //  Which is the largest?
        if (this.overlapX !== 0 && this.overlapY !== 0)
        {
            //  Crudely find out which is the largest penetration side
            if (Math.abs(this.overlapX) > Math.abs(this.overlapY))
            {
                //  Vertical penetration (as x is larger than y)
                this.overlapX = 0;
                this.touching.left = false;
                this.touching.right = false;
            }
            else
            {
                //  Horizontal penetration (as y is larger than x)
                this.overlapY = 0;
                this.touching.up = false;
                this.touching.down = false;
            }
        }

        //  overlapX/Y now contains either zero or a positive value containing the overlapping area
        return (this.overlapX !== 0 || this.overlapY !== 0);

    },

    //  Check if we're below minVelocity and gravity isn't trying to drag us in the opposite direction
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
    * Process a collision with the left face of this Body. If possible the Body will be moved right.
    * Uses overlayX which will be positive.
    *
    * @method Phaser.Physics.Arcade#hitLeft
    * @protected
    * @param {number} x - The overlapX value.
    * @param {Phaser.Physics.Arcade.Body} body - The Body that collided.
    * @param {number} nv1 - The new velocity for this Body.
    * @param {number} nv2 - The new velocity for the colliding Body.
    * @param {number} avg - The new average velocity between the two Bodies.
    */
    hitLeft: function (x, body, nv1, nv2, avg) {

        //  This body isn't moving horizontally, so it was hit by something moving right
        if (this.immovable || this.blocked.right)
        {
            body.x -= x;
            body.velocity.x = this.velocity.x - body.velocity.x * body.bounce.x;
            body.reboundCheck(true, false);
        }
        else
        {
            if (body.immovable || body.blocked.left)
            {
                //  We take the full separation as what hit is isn't moveable
                this.x += x;
                this.velocity.x = body.velocity.x - this.velocity.x * this.bounce.x;
                this.reboundCheck(true, false);
            }
            else
            {
                //  Share the separation
                x *= 0.5;
                this.x += x;
                body.x -= x;
                this.velocity.x = avg + nv1 * this.bounce.x;
                body.velocity.x = avg + nv2 * body.bounce.x;

                this.reboundCheck(true, false);
                body.reboundCheck(true, false);
            }
        }

        //  Bounds check
        if (this.checkWorldBounds && this.right >= this.game.world.bounds.right)
        {
            this.blocked.right = true;
            this.x -= this.right - this.game.world.bounds.right;
        }

        if (this.collideCallback)
        {
            this.collideCallback.call(this.collideCallbackContext, Phaser.LEFT, this, body);
        }

    },

    /**
    * Process a collision with the right face of this Body. If possible the Body will be moved left.
    * Uses overlayX which will be negative.
    *
    * @method Phaser.Physics.Arcade#hitRight
    * @protected
    * @param {number} x - The overlapX value.
    * @param {Phaser.Physics.Arcade.Body} body - The Body that collided.
    * @param {number} nv1 - The new velocity for this Body.
    * @param {number} nv2 - The new velocity for the colliding Body.
    * @param {number} avg - The new average velocity between the two Bodies.
    */
    hitRight: function (x, body, nv1, nv2, avg) {

        //  This body isn't moving horizontally, so it was hit by something moving right
        if (this.immovable || this.blocked.left)
        {
            body.x -= x;
            body.velocity.x = this.velocity.x - body.velocity.x * body.bounce.x;
            body.reboundCheck(true, false);
        }
        else
        {
            if (body.immovable || body.blocked.right)
            {
                //  We take the full separation as what hit is isn't moveable
                this.x += x;
                this.velocity.x = body.velocity.x - this.velocity.x * this.bounce.x;
                this.reboundCheck(true, false);
            }
            else
            {
                //  Share the separation
                x *= 0.5;
                this.x += x;
                body.x -= x;
                this.velocity.x = avg + nv1 * this.bounce.x;
                body.velocity.x = avg + nv2 * body.bounce.x;
    
                this.reboundCheck(true, false);
                body.reboundCheck(true, false);
            }
        }

        //  Bounds check
        if (this.checkWorldBounds && this.x <= this.game.world.bounds.x)
        {
            this.blocked.left = true;
            this.x += this.game.world.bounds.x - this.x;
        }

        if (this.collideCallback)
        {
            this.collideCallback.call(this.collideCallbackContext, Phaser.RIGHT, this, body);
        }

    },

    /**
    * Process a collision with the top face of this Body. If possible the Body will be moved down.
    * Uses overlayY which will be positive.
    *
    * @method Phaser.Physics.Arcade#hitUp
    * @protected
    * @param {number} y - The overlapY value.
    * @param {Phaser.Physics.Arcade.Body} body - The Body that collided.
    * @param {number} nv1 - The new velocity for this Body.
    * @param {number} nv2 - The new velocity for the colliding Body.
    * @param {number} avg - The new average velocity between the two Bodies.
    */
    hitUp: function (y, body, nv1, nv2, avg) {

        //  This body isn't moving horizontally, so it was hit by something moving right
        if (this.immovable || this.blocked.down)
        {
            body.y -= y;
            body.velocity.y = this.velocity.y - body.velocity.y * body.bounce.y;
            body.reboundCheck(true, false);
        }
        else
        {
            if (body.immovable || body.blocked.up)
            {
                //  We take the full separation as what hit is isn't moveable
                this.y += y;
                this.velocity.y = body.velocity.y - this.velocity.y * this.bounce.y;
                this.reboundCheck(false, true);
            }
            else
            {
                //  Share the separation
                y *= 0.5;
                this.y += y;
                body.y -= y;
                this.velocity.y = avg + nv1 * this.bounce.y;
                body.velocity.y = avg + nv2 * body.bounce.y;
    
                this.reboundCheck(false, true);
                body.reboundCheck(true, false);
            }
        }

        //  Bounds check
        if (this.checkWorldBounds && this.bottom >= this.game.world.bounds.bottom)
        {
            this.blocked.down = true;
            this.y -= this.bottom - this.game.world.bounds.bottom;
        }

        if (this.collideCallback)
        {
            this.collideCallback.call(this.collideCallbackContext, Phaser.UP, this, body);
        }

    },

    /**
    * Process a collision with the bottom face of this Body. If possible the Body will be moved up.
    * Uses overlayY which will be negative.
    *
    * @method Phaser.Physics.Arcade#hitDown
    * @protected
    * @param {number} y - The overlapY value.
    * @param {Phaser.Physics.Arcade.Body} body - The Body that collided.
    * @param {number} nv1 - The new velocity for this Body.
    * @param {number} nv2 - The new velocity for the colliding Body.
    * @param {number} avg - The new average velocity between the two Bodies.
    */
    hitDown: function (y, body, nv1, nv2, avg) {

        //  This body isn't moving horizontally, so it was hit by something moving right
        if (this.immovable || this.blocked.up)
        {
            body.y -= y;
            body.velocity.y = this.velocity.y - body.velocity.y * body.bounce.y;
            body.reboundCheck(true, false);
        }
        else
        {
            if (body.immovable || body.blocked.down)
            {
                //  We take the full separation as what hit is isn't moveable
                this.y += y;
                this.velocity.y = body.velocity.y - this.velocity.y * this.bounce.y;
                this.reboundCheck(false, true);
            }
            else
            {
                //  Share the separation
                y *= 0.5;
                this.y += y;
                body.y -= y;
                this.velocity.y = avg + nv1 * this.bounce.y;
                body.velocity.y = avg + nv2 * body.bounce.y;
                this.reboundCheck(false, true);
                body.reboundCheck(true, false);
            }
        }

        //  Bounds check
        if (this.checkWorldBounds && this.y <= this.game.world.bounds.y)
        {
            this.blocked.up = true;
            this.y += this.game.world.bounds.y - this.y;
        }

        if (this.collideCallback)
        {
            this.collideCallback.call(this.collideCallbackContext, Phaser.DOWN, this, body);
        }

    },

    /**
    * This separates this Body from the given Body unless a customSeparateCallback is set.
    * It assumes they have already been overlap checked and the resulting overlap is stored in overlapX and overlapY.
    *
    * @method Phaser.Physics.Arcade#separate
    * @protected
    * @param {Phaser.Physics.Arcade.Body} body - The Body to be separated from this one.
    * @return {boolean}
    */
    separate: function (body) {

        if (this.customSeparateCallback)
        {
            return this.customSeparateCallback.call(this.customSeparateContext, this, this.overlapX, this.overlapY);
        }

        if (this.overlapX !== 0)
        {
            this._newVelocity1 = Math.sqrt((body.velocity.x * body.velocity.x * body.mass) / this.mass) * ((body.velocity.x > 0) ? 1 : -1);
            this._newVelocity2 = Math.sqrt((this.velocity.x * this.velocity.x * this.mass) / body.mass) * ((this.velocity.x > 0) ? 1 : -1);
            this._average = (this._newVelocity1 + this._newVelocity2) * 0.5;
            this._newVelocity1 -= this._average;
            this._newVelocity2 -= this._average;

            if (this.overlapX < 0)
            {
                this.hitLeft(this.overlapX, body, this._newVelocity1, this._newVelocity2, this._average);
            }
            else if (this.overlapX > 0)
            {
                this.hitRight(this.overlapX, body, this._newVelocity1, this._newVelocity2, this._average);
            }
        }

        if (this.overlapY !== 0)
        {
            this._newVelocity1 = Math.sqrt((body.velocity.y * body.velocity.y * body.mass) / this.mass) * ((body.velocity.y > 0) ? 1 : -1);
            this._newVelocity2 = Math.sqrt((this.velocity.y * this.velocity.y * this.mass) / body.mass) * ((this.velocity.y > 0) ? 1 : -1);
            this._average = (this._newVelocity1 + this._newVelocity2) * 0.5;
            this._newVelocity1 -= this._average;
            this._newVelocity2 -= this._average;

            if (this.overlapY < 0)
            {
                this.hitDown(this.overlapY, body, this._newVelocity1, this._newVelocity2, this._average);
            }
            else if (this.overlapY > 0)
            {
                this.hitUp(this.overlapY, body, this._newVelocity1, this._newVelocity2, this._average);
            }
        }
            
        return true;

    },

    /**
    * Internal method. This is called directly before the sprites are sent to the renderer.
    *
    * @method Phaser.Physics.Arcade#postUpdate
    * @protected
    */
    postUpdate: function () {

        if (this.moves)
        {
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
