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
    * @property {number} width - The calculated width of the physics body.
    */
    this.width = sprite.currentFrame.sourceSizeW;

    /**
    * @property {number} height - The calculated height of the physics body.
    */
    this.height = sprite.currentFrame.sourceSizeH;

    /**
    * @property {Phaser.Point} center - The center coordinate of the Physics Body.
    */
    this.center = new Phaser.Point(this.x + this.halfWidth, this.y + this.halfHeight);

    /**
    * @property {Phaser.Point} motionVelocity - The data from the updateMotion function.
    */
    this.motionVelocity = new Phaser.Point();

    /**
    * @property {Phaser.Point} velocity - The velocity in pixels per second sq. of the Body.
    */
    this.velocity = new Phaser.Point();

    /**
    * @property {Phaser.Point} acceleration - The velocity in pixels per second sq. of the Body.
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
    // this.minBounceVelocity = 0.5;

    this._debug = 0;

    /**
    * @property {Phaser.Point} gravity - The gravity applied to the motion of the Body.
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
    this.minVelocity = new Phaser.Point(20, 20);

    /**
    * @property {Phaser.Point} maxVelocity - The maximum velocity in pixels per second sq. that the Body can reach.
    * @default
    */
    this.maxVelocity = new Phaser.Point(10000, 10000);

    /**
    * @property {number} angularVelocity - The angular velocity in pixels per second sq. of the Body.
    * @default
    */
    this.angularVelocity = 0;

    /**
    * @property {number} angularAcceleration - The angular acceleration in pixels per second sq. of the Body.
    * @default
    */
    this.angularAcceleration = 0;

    /**
    * @property {number} angularDrag - The angular drag applied to the rotation of the Body.
    * @default
    */
    this.angularDrag = 0;

    /**
    * @property {number} maxAngular - The maximum angular velocity in pixels per second sq. that the Body can reach.
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
    * @property {boolean} immovable - An immovable Body will not receive any impacts or exchanges of velocity from other bodies.
    * @default
    */
    this.immovable = false;

    /**
    * @property {boolean} moves - Set to true to allow the Physics system to move this Body, other false to move it manually.
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
    * This flag allows you to disable the custom x separation that takes place by Physics.Arcade.separate.
    * Used in combination with your own collision processHandler you can create whatever type of collision response you need.
    * @property {boolean} customSeparateX - Use a custom separation system or the built-in one?
    * @default
    */
    this.customSeparateX = false;

    /**
    * This flag allows you to disable the custom y separation that takes place by Physics.Arcade.separate.
    * Used in combination with your own collision processHandler you can create whatever type of collision response you need.
    * @property {boolean} customSeparateY - Use a custom separation system or the built-in one?
    * @default
    */
    this.customSeparateY = false;

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
    this.friction = 0;

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

    this.shape = new SAT.Box(new SAT.Vector(this.x, this.y), this.width, this.height);
    this.polygon = this.shape.toPolygon();
    this.response = new SAT.Response();

};

Phaser.Physics.Arcade.Body.prototype = {

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade#updateBounds
    * @protected
    */
    updateBounds: function (centerX, centerY, scaleX, scaleY) {

        // if (scaleX != this._sx || scaleY != this._sy)
        // {
        //     this.width = this.sourceWidth * scaleX;
        //     this.height = this.sourceHeight * scaleY;
        //     this.halfWidth = Math.floor(this.width / 2);
        //     this.halfHeight = Math.floor(this.height / 2);
        //     this._sx = scaleX;
        //     this._sy = scaleY;
        //     this.center.setTo(this.x + this.halfWidth, this.y + this.halfHeight);
        // }

    },

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade#preUpdate
    * @protected
    */
    preUpdate: function () {

        // this.screenX = (this.sprite.worldTransform[2] - (this.sprite.anchor.x * this.width)) + this.offset.x;
        // this.screenY = (this.sprite.worldTransform[5] - (this.sprite.anchor.y * this.height)) + this.offset.y;

        this.preX = (this.sprite.world.x - (this.sprite.anchor.x * this.width)) + this.offset.x;
        this.preY = (this.sprite.world.y - (this.sprite.anchor.y * this.height)) + this.offset.y;
        // this.preRotation = this.sprite.angle;
        this.preRotation = this.sprite.rotation;

        //  This all needs to move - because a body may start the preUpdate already touching something
        this.blocked.up = false;
        this.blocked.down = false;
        this.blocked.left = false;
        this.blocked.right = false;

        this.x = this.preX;
        this.y = this.preY;
        // this.rotation = this.preRotation;

        this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        this.angle = Math.atan2(this.velocity.y, this.velocity.x);

        this._debug++;

        if (this.moves)
        {
            if (this.collideWorldBounds)
            {
                this.checkWorldBounds();
            }

            this.game.physics.updateMotion(this);
            
            this.applyMotion();
        }

        this.polygon.pos.x = this.x;
        this.polygon.pos.y = this.y;

        if (this.deltaZ() !== 0)
        {
            // this.polygon.rotate(this.sprite.rotation);
            // console.log(this.sprite.rotation);
        }
        // this.polygon.rotate(this.game.math.degToRad(this.rotation));

    },

    /**
    * Internal method used to check the Body against the World Bounds.
    *
    * @method Phaser.Physics.Arcade#checkWorldBounds
    * @protected
    */
    checkWorldBounds: function () {

        if (this.x <= this.game.world.bounds.x)
        {
            this.overlapX = this.game.world.bounds.x - this.x;
            this.blocked.left = true;
            // console.log(this._debug, 'cwl', this.overlapX, this.x, this.game.world.bounds.x);
        }
        else if (this.right >= this.game.world.bounds.right)
        {
            this.overlapX = this.right - this.game.world.bounds.right;
            this.blocked.right = true;
            // console.log(this._debug, 'cwr', this.overlapX, this.x, this.game.world.bounds.x);
        }

        if (this.y <= this.game.world.bounds.y)
        {
            this.overlapY = this.game.world.bounds.y - this.y;
            this.blocked.up = true;
            // console.log(this._debug, 'cwu', this.overlapY, this.y, this.height, this.bottom, this.game.world.bounds.bottom);
        }
        else if (this.bottom >= this.game.world.bounds.bottom)
        {
            this.overlapY = this.bottom - this.game.world.bounds.bottom;
            this.blocked.down = true;
            // console.log(this._debug, 'cwd', this.overlapY, this.y, this.height, this.bottom, this.game.world.bounds.bottom);
        }

        this.blockedPoint.setTo(this.x, this.y);

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
        if (this.blocked.left)
        {
            //  Separate
            this.x += this.overlapX;

            // console.log(this._debug, 'blocked left', this.x, this.overlapX);

            this.velocity.x *= -this.bounce.x;

            this._dx = this.game.time.physicsElapsed * (this.velocity.x + this.motionVelocity.x / 2);

            // if (this._dx > this.minBounceVelocity)
            if (Math.abs(this.velocity.x) > this.minVelocity.x)
            {
                this.x += this._dx;
                this.velocity.x += this.motionVelocity.x;
                // console.log(this._debug, 'blocked left', this._dx, 'overlap', this.overlapX, 'delta', this.deltaX(), 'newy', this.x);
            }
            else
            {
                //  Kill it dead :)
                this.preX = this.x; // because we don't want any delta from a separation
                this.velocity.x = 0;
                this.motionVelocity.x = 0;
                // console.log(this._debug, 'blocked left KILL', this._dx, 'overlap', this.overlapX, 'delta', this.deltaX(), 'newy', this.x);
            }
        }
        else if (this.blocked.right)
        {
            //  Separate
            this.x -= this.overlapX;

            this.velocity.x *= -this.bounce.x;

            this._dx = this.game.time.physicsElapsed * (this.velocity.x + this.motionVelocity.x / 2);

            if (this._dx < -this.minBounceVelocity)
            {
                this.x += this._dx;
                this.velocity.x += this.motionVelocity.x;
                // console.log(this._debug, 'blocked right', this._dx, 'overlap', this.overlapX, 'delta', this.deltaX(), 'newy', this.x);
            }
            else
            {
                //  Kill it dead :)
                this.preX = this.x; // because we don't want any delta from a separation
                this.velocity.x = 0;
                this.motionVelocity.x = 0;
                // console.log(this._debug, 'blocked right KILL', this._dx, 'overlap', this.overlapX, 'delta', this.deltaX(), 'newy', this.x);
            }
        }
        else
        {
            this.x += this.game.time.physicsElapsed * (this.velocity.x + this.motionVelocity.x / 2);
            this.velocity.x += this.motionVelocity.x;
        }

        //  overlapX/Y values at this point will be penetration into the bounds and DELTA WILL BE ZERO
        if (this.blocked.up)
        {
            //  Separate
            this.y += this.overlapY;

            this.velocity.y *= -this.bounce.y;

            this._dy = this.game.time.physicsElapsed * (this.velocity.y + this.motionVelocity.y / 2);

            // if (this._dy > this.minBounceVelocity)
            if (Math.abs(this.velocity.y) > this.minVelocity.y)
            {
                this.y += this._dy;
                this.velocity.y += this.motionVelocity.y;
            }
            else
            {
                //  Kill it dead :)
                this.preY = this.y; // because we don't want any delta from a separation
                this.velocity.y = 0;
                this.motionVelocity.y = 0;
                // console.log(this._debug, 'void1', this.velocity.y, 'delta', this.deltaY());
            }
        }
        else if (this.blocked.down)
        {
            //  Separate
            this.y -= this.overlapY;

            this.velocity.y *= -this.bounce.y;

            this._dy = this.game.time.physicsElapsed * (this.velocity.y + this.motionVelocity.y / 2);

            // if (this._dy < -this.minBounceVelocity)
            if (Math.abs(this.velocity.y) > this.minVelocity.y)
            {
                this.y += this._dy;
                this.velocity.y += this.motionVelocity.y;
                // console.log(this._debug, 'rb', this._dy, 'delta', this.deltaY(), 'newy', this.y);
            }
            else
            {
                //  Kill it dead :)
                this.preY = this.y; // because we don't want any delta from a separation
                this.velocity.y = 0;
                this.motionVelocity.y = 0;
                // console.log(this._debug, 'void1', this.velocity.y, 'delta', this.deltaY());
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

    collide: function (body) {

        this.response.clear();

        // if (this._debug === 100)
        // {
        //     console.log(this.sprite.name, this.polygon);
        // }

        if (SAT.testPolygonPolygon(this.polygon, body.polygon, this.response))
        {

            // b1.pos.sub(r.overlapV);
            // sprite.body.velocity.x *= -sprite.body.bounce.x;

            this.velocity.x = 0;

            //  separate
            this.x += Math.ceil(Math.abs(this.response.overlapV.x));
            this.y += Math.ceil(Math.abs(this.response.overlapV.y));

            console.log(this.response, this.deltaX());

            console.log('sprite moved to', this.x, this.deltaX());
        }

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
            this.sprite.x += this.deltaX();
            this.sprite.y += this.deltaY();

            this.sprite.worldTransform[2] += this.deltaX();
            this.sprite.worldTransform[5] += this.deltaY();

            this.center.setTo(this.x + this.halfWidth, this.y + this.halfHeight);

            this.rotation = this.preRotation;

            if (this.allowRotation)
            {
                // this.sprite.angle += this.deltaZ();
            }
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
