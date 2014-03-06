/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Physics Body is linked to a single Sprite. All physics operations should be performed against the body rather than
* the Sprite itself. For example you can set the velocity, bounce values etc all on the Body.
*
* @class Phaser.Physics.Ninja.Body
* @classdesc Ninja Physics Body Constructor
* @constructor
* @param {Phaser.Physics.Ninja} system - The physics system this Body belongs to.
* @param {Phaser.Sprite} sprite - The Sprite object this physics body belongs to.
* @param {number} [type=1] - The type of Ninja shape to create. 1 = AABB, 2 = Circle or 3 = Tile.
* @param {number} [id=1] - If this body is using a Tile shape, you can set the Tile id here, i.e. Phaser.Physics.Ninja.Tile.SLOPE_45DEGpn, Phaser.Physics.Ninja.Tile.CONVEXpp, etc.
* @param {number} [radius=16] - If this body is using a Circle shape this controls the radius.
*/
Phaser.Physics.Ninja.Body = function (system, sprite, type, id, radius) {

    if (typeof type === 'undefined') { type = 1; }
    if (typeof id === 'undefined') { id = 1; }
    if (typeof radius === 'undefined') { radius = 16; }

    /**
    * @property {Phaser.Sprite} sprite - Reference to the parent Sprite.
    */
    this.sprite = sprite;

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = sprite.game;

    /**
    * @property {number} type - The type of physics system this body belongs to.
    */
    this.type = Phaser.Physics.NINJA;

    /**
    * @property {Phaser.Physics.Ninja} system - The parent physics system.
    */
    this.system = system;

    /**
    * @property {Phaser.Physics.Ninja.AABB} aabb - The AABB object this body is using for collision.
    */
    this.aabb = null;

    /**
    * @property {Phaser.Physics.Ninja.Tile} tile - The Tile object this body is using for collision.
    */
    this.tile = null;

    /**
    * @property {Phaser.Physics.Ninja.Circle} circle - The Circle object this body is using for collision.
    */
    this.circle = null;

    /**
    * @property {object} shape - A local reference to the body shape.
    */
    this.shape = null;

    if (type === 1)
    {
        this.aabb = new Phaser.Physics.Ninja.AABB(system, sprite.x, sprite.y, sprite.width, sprite.height);
        this.shape = this.aabb;
    }
    else if (type === 2)
    {
        this.circle = new Phaser.Physics.Ninja.Circle(system, sprite.x, sprite.y, radius);
        this.shape = this.circle;
    }
    else if (type === 3)
    {
        this.tile = new Phaser.Physics.Ninja.Tile(system, sprite.x, sprite.y, sprite.width, sprite.height, id);
        this.shape = this.tile;
    }

    /**
    * @property {Phaser.Point} velocity - The velocity in pixels per second sq. of the Body.
    */
    this.velocity = new Phaser.Point();

    /**
    * @property {Phaser.Point} drag - The drag applied to the motion of the Body.
    */
    this.drag = new Phaser.Point();

    /**
    * @property {Phaser.Point} bounce - The elasticitiy of the Body when colliding. bounce.x/y = 1 means full rebound, bounce.x/y = 0.5 means 50% rebound velocity.
    */
    this.bounce = new Phaser.Point();

    /**
    * @property {boolean} skipQuadTree - If the Body is an irregular shape you can set this to true to avoid it being added to any QuadTrees.
    * @default
    */
    this.skipQuadTree = false;

    /**
    * @property {number} facing - A const reference to the direction the Body is traveling or facing.
    * @default
    */
    this.facing = Phaser.NONE;

    /**
    * @property {boolean} immovable - An immovable Body will not receive any impacts from other bodies.
    * @default
    */
    this.immovable = false;

    /**
    * A Body can be set to collide against the World bounds automatically and rebound back into the World if this is set to true. Otherwise it will leave the World.
    * @property {boolean} collideWorldBounds - Should the Body collide with the World bounds?
    */
    this.collideWorldBounds = true;

    /**
    * This object is populated with boolean values when the Body collides with another.
    * touching.up = true means the collision happened to the top of this Body for example.
    * @property {object} touching - An object containing touching results.
    */
    this.touching = { none: true, up: false, down: false, left: false, right: false };

    /**
    * This object is populated with previous touching values from the bodies previous collision.
    * @property {object} wasTouching - An object containing previous touching results.
    */
    this.wasTouching = { none: true, up: false, down: false, left: false, right: false };

    this.maxSpeed = 8;

};

Phaser.Physics.Ninja.Body.prototype = {

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Ninja.Body#updateBounds
    * @protected
    */
    updateBounds: function (centerX, centerY, scaleX, scaleY) {

        if (scaleX != this._sx || scaleY != this._sy)
        {
            // this.width = this.sourceWidth * scaleX;
            // this.height = this.sourceHeight * scaleY;
            // this.halfWidth = Math.floor(this.width / 2);
            // this.halfHeight = Math.floor(this.height / 2);
            // this._sx = scaleX;
            // this._sy = scaleY;
            // this.center.setTo(this.x + this.halfWidth, this.y + this.halfHeight);
        }

    },

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Ninja.Body#preUpdate
    * @protected
    */
    preUpdate: function () {

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

        this.shape.integrate();

        if (this.collideWorldBounds)
        {
            this.shape.collideWorldBounds();
        }

        this.speed = Math.sqrt(this.shape.velocity.x * this.shape.velocity.x + this.shape.velocity.y * this.shape.velocity.y);
        this.angle = Math.atan2(this.shape.velocity.y, this.shape.velocity.x);

    },

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Ninja.Body#postUpdate
    * @protected
    */
    postUpdate: function () {

        this.sprite.x = this.shape.pos.x;
        this.sprite.y = this.shape.pos.y;

    },

    /**
    * Stops all movement of this body.
    *
    * @method Phaser.Physics.Ninja.Body#setZeroVelocity
    */
    setZeroVelocity: function () {

        this.shape.oldpos.x = this.shape.pos.x;
        this.shape.oldpos.y = this.shape.pos.y;

    },

    /**
    * Moves the Body forwards based on its current angle and the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveTo
    * @param {number} speed - The speed at which it should move forwards.
    * @param {number} angle - The angle in which it should move, given in degrees.
    */
    moveTo: function (speed, angle) {

        var magnitude = speed * this.game.time.physicsElapsed;
        var angle = this.game.math.degToRad(angle);

        this.shape.pos.x = this.shape.oldpos.x + (magnitude * Math.cos(angle));
        this.shape.pos.y = this.shape.oldpos.y + (magnitude * Math.sin(angle));

    },

    /**
    * Moves the Body backwards based on its current angle and the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveBackward
    * @param {number} speed - The speed at which it should move backwards.
    * @param {number} angle - The angle in which it should move, given in degrees.
    */
    moveFrom: function (speed, angle) {

        var magnitude = -speed * this.game.time.physicsElapsed;
        var angle = this.game.math.degToRad(angle);

        this.shape.pos.x = this.shape.oldpos.x + (magnitude * Math.cos(angle));
        this.shape.pos.y = this.shape.oldpos.y + (magnitude * Math.sin(angle));

    },

    /**
    * If this Body is dynamic then this will move it to the left by setting its x velocity to the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveLeft
    * @param {number} speed - The speed at which it should move to the left, in pixels per second.
    */
    moveLeft: function (speed) {

        var fx = -speed * this.game.time.physicsElapsed;

        this.shape.pos.x = this.shape.oldpos.x + Math.min(this.maxSpeed, Math.max(-this.maxSpeed, this.shape.pos.x - this.shape.oldpos.x + fx));

    },

    /**
    * If this Body is dynamic then this will move it to the right by setting its x velocity to the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveRight
    * @param {number} speed - The speed at which it should move to the right, in pixels per second.
    */
    moveRight: function (speed) {

        var fx = speed * this.game.time.physicsElapsed;

        this.shape.pos.x = this.shape.oldpos.x + Math.min(this.maxSpeed, Math.max(-this.maxSpeed, this.shape.pos.x - this.shape.oldpos.x + fx));

    },

    /**
    * If this Body is dynamic then this will move it up by setting its y velocity to the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveUp
    * @param {number} speed - The speed at which it should move up, in pixels per second.
    */
    moveUp: function (speed) {

        var fx = -speed * this.game.time.physicsElapsed;

        this.shape.pos.y = this.shape.oldpos.y + Math.min(this.maxSpeed, Math.max(-this.maxSpeed, this.shape.pos.y - this.shape.oldpos.y + fx));

    },

    /**
    * If this Body is dynamic then this will move it down by setting its y velocity to the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveDown
    * @param {number} speed - The speed at which it should move down, in pixels per second.
    */
    moveDown: function (speed) {

        var fx = speed * this.game.time.physicsElapsed;

        this.shape.pos.y = this.shape.oldpos.y + Math.min(this.maxSpeed, Math.max(-this.maxSpeed, this.shape.pos.y - this.shape.oldpos.y + fx));

    },

    /**
    * Resets all Body values (velocity, acceleration, rotation, etc)
    *
    * @method Phaser.Physics.Ninja.Body#reset
    */
    reset: function () {
    },

};

/**
* @name Phaser.Physics.Ninja.Body#x
* @property {number} x - The x position.
*/
Object.defineProperty(Phaser.Physics.Ninja.Body.prototype, "x", {
    
    /**
    * The x position.
    * @method x
    * @return {number}
    */
    get: function () {
        return this.shape.pos.x;
    },

    /**
    * The x position.
    * @method x
    * @param {number} value
    */
    set: function (value) {
        this.shape.pos.x = value;
    }

});

/**
* @name Phaser.Physics.Ninja.Body#y
* @property {number} y - The y position.
*/
Object.defineProperty(Phaser.Physics.Ninja.Body.prototype, "y", {
    
    /**
    * The y position.
    * @method y
    * @return {number}
    */
    get: function () {
        return this.shape.pos.y;
    },

    /**
    * The y position.
    * @method y
    * @param {number} value
    */
    set: function (value) {
        this.shape.pos.y = value;
    }

});

/**
* @name Phaser.Physics.Ninja.Body#bottom
* @property {number} bottom - The bottom value of this Body (same as Body.y + Body.height)
* @readonly
*/
Object.defineProperty(Phaser.Physics.Ninja.Body.prototype, "bottom", {
    
    /**
    * The sum of the y and height properties.
    * @method bottom
    * @return {number}
    * @readonly
    */
    get: function () {
        return this.shape.pos.y + this.shape.height;
    }

});

/**
* @name Phaser.Physics.Ninja.Body#right
* @property {number} right - The right value of this Body (same as Body.x + Body.width)
* @readonly
*/
Object.defineProperty(Phaser.Physics.Ninja.Body.prototype, "right", {
    
    /**
    * The sum of the x and width properties.
    * @method right
    * @return {number}
    * @readonly
    */
    get: function () {
        return this.shape.pos.x + this.shape.width;
    }

});
