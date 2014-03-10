/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
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
    * @property {number} type - The type of physics system this body belongs to.
    */
    this.type = Phaser.Physics.ARCADE;

    /**
    * @property {Phaser.Point} offset - The offset of the Physics Body from the Sprite x/y position.
    */
    this.offset = new Phaser.Point(-(sprite.anchor.x * sprite.width), -(sprite.anchor.y * sprite.height));

    /**
    * @property {Phaser.Point} position - The position of the physics body.
    * @readonly
    */
    this.position = new Phaser.Point(sprite.x + this.offset.x, sprite.y + this.offset.y);

    /**
    * @property {Phaser.Point} prev - The previous position of the physics body.
    * @readonly
    */
    this.prev = new Phaser.Point(this.position.x, this.position.y);

    /**
    * @property {number} preRotation - The previous rotation of the physics body.
    * @readonly
    */
    this.preRotation = sprite.angle;

    /**
    * @property {number} sourceWidth - The un-scaled original size.
    * @readonly
    */
    this.sourceWidth = sprite.texture.frame.width;

    /**
    * @property {number} sourceHeight - The un-scaled original size.
    * @readonly
    */
    this.sourceHeight = sprite.texture.frame.height;

    /**
    * @property {number} width - The calculated width of the physics body.
    */
    this.width = sprite.width;

    /**
    * @property .numInternal ID cache
    */
    this.height = sprite.height;

    /**
    * @property {number} halfWidth - The calculated width / 2 of the physics body.
    */
    this.halfWidth = Math.abs(sprite.width / 2);

    /**
    * @property {number} halfHeight - The calculated height / 2 of the physics body.
    */
    this.halfHeight = Math.abs(sprite.height / 2);

    /**
    * @property {Phaser.Point} center - The center coordinate of the Physics Body.
    */
    this.center = new Phaser.Point(sprite.x + this.halfWidth, sprite.y + this.halfHeight);

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
    * @property {Phaser.Point} velocity - The velocity in pixels per second sq. of the Body.
    */
    this.velocity = new Phaser.Point();

    /**
    * @property {Phaser.Point} newVelocity - New velocity.
    * @readonly
    */
    this.newVelocity = new Phaser.Point(0, 0);

    /**
    * @property {Phaser.Point} acceleration - The velocity in pixels per second sq. of the Body.
    */
    this.acceleration = new Phaser.Point();

    /**
    * @property {Phaser.Point} drag - The drag applied to the motion of the Body.
    */
    this.drag = new Phaser.Point();

    /**
    * @property {Phaser.Point} gravityScale - Gravity scaling factor. If you want the body to ignore gravity, set this to zero. If you want to reverse gravity, set it to -1.
    */
    this.gravityScale = new Phaser.Point(1, 1);

    /**
    * @property {Phaser.Point} bounce - The elasticitiy of the Body when colliding. bounce.x/y = 1 means full rebound, bounce.x/y = 0.5 means 50% rebound velocity.
    */
    this.bounce = new Phaser.Point();

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
    * @property {boolean} moves - Set to true to allow the Physics system to move this Body, other false to move it manually.
    * @default
    */
    this.moves = true;

    /**
    * @property {number} rotation - The amount the Body is rotated.
    * @default
    */
    this.rotation = 0;

    /**
    * @property {boolean} allowRotation - Allow this Body to be rotated? (via angularVelocity, etc)
    * @default
    */
    this.allowRotation = true;

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
    * If a body is overlapping with another body, but neither of them are moving (maybe they spawned on-top of each other?) this is set to true.
    * @property {boolean} embedded - Body embed value.
    */
    this.embedded = false;

    /**
    * A Body can be set to collide against the World bounds automatically and rebound back into the World if this is set to true. Otherwise it will leave the World.
    * @property {boolean} collideWorldBounds - Should the Body collide with the World bounds?
    */
    this.collideWorldBounds = false;

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
    * This object is populated with previous touching values from the bodies previous collision.
    * @property {object} wasTouching - An object containing previous touching results.
    */
    this.wasTouching = { none: true, up: false, down: false, left: false, right: false };

    /**
    * This object is populated with boolean values when the Body collides with the World bounds or a Tile.
    * For example if blocked.up is true then the Body cannot move up.
    * @property {object} blocked - An object containing on which faces this Body is blocked from moving, if any.
    */
    this.blocked = { x: 0, y: 0, up: false, down: false, left: false, right: false };

    /**
    * This object is populated with boolean values when the Body collides with the World bounds or a Tile.
    * For example if blocked.up is true then the Body cannot move up.
    * @property {object} blocked - An object containing on which faces this Body is blocked from moving, if any.
    */
    this.result = { x: 0, y: 0, px: 0, py: 0, tx: 0, ty: 0, slope: false };

};

Phaser.Physics.Arcade.Body.prototype = {

    resetResult: function () {

        this.result.x = false;
        this.result.y = false;
        this.result.slope = false;
        this.result.px = this.position.x;
        this.result.py = this.position.y;
        this.result.tx = 0;
        this.result.ty = 0;

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

        this.resetResult();

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

        this.embedded = false;

        // this.screenX = (this.sprite.worldTransform[2] - (this.sprite.anchor.x * this.width)) + this.offset.x;
        // this.screenY = (this.sprite.worldTransform[5] - (this.sprite.anchor.y * this.height)) + this.offset.y;

        //  this is where the Sprite currently is, in world coordinates
        // this.preX = (this.sprite.world.x - (this.sprite.anchor.x * this.width)) + this.offset.x;
        // this.preY = (this.sprite.world.y - (this.sprite.anchor.y * this.height)) + this.offset.y;
        this.preRotation = this.sprite.angle;

        // this.x = this.preX;
        // this.y = this.preY;
        // this.rotation = this.preRotation;

        // this.overlapX = 0;
        // this.overlapY = 0;

        this.prev.set(this.position.x, this.position.y);

        // this.position.x = (this.sprite.world.x - (this.sprite.anchor.x * this.width)) + this.offset.x;
        // this.position.y = (this.sprite.world.y - (this.sprite.anchor.y * this.height)) + this.offset.y;


        // this.blocked.up = false;
        // this.blocked.down = false;
        // this.blocked.left = false;
        // this.blocked.right = false;

        if (this.moves)
        {
            this.game.physics.arcade.updateMotion(this);

            this.newVelocity.set(this.velocity.x * this.game.time.physicsElapsed, this.velocity.y * this.game.time.physicsElapsed);

            this.position.x += this.newVelocity.x;
            this.position.y += this.newVelocity.y;

            //  Now the State update will throw collision checks at the Body
            //  And finally we'll integrate the new position back to the Sprite in postUpdate

            if (this.collideWorldBounds)
            {
                this.checkWorldBounds();
            }
        }

    },

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade#postUpdate
    * @protected
    */
    postUpdate: function () {

        // if (this.result.x)
        // {
        //     this.position.x = this.result.px;
        //     this.velocity.x = 0;
        // }
        // else
        // {
        //     this.position.x += this.newVelocity.x;
        // }

        // this.position.y += this.newVelocity.y;

        // this.position.add(this.newVelocity.x, this.newVelocity.y);

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

        if (this.deltaX() !== 0 || this.deltaY() !== 0)
        {
            //  this is where the Sprite currently is, in world coordinates
            // this.sprite.x = (this.sprite.world.x - (this.sprite.anchor.x * this.width)) + this.offset.x;
            // this.sprite.y = (this.sprite.world.y - (this.sprite.anchor.y * this.height)) + this.offset.y;
            this.sprite.x = (this.position.x - this.offset.x);
            this.sprite.y = (this.position.y - this.offset.y);
            this.center.setTo(this.x + this.halfWidth, this.y + this.halfHeight);
        }

        if (this.allowRotation)
        {
            this.sprite.angle += this.deltaZ();
        }

    },

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade#checkWorldBounds
    * @protected
    */
    checkWorldBounds: function () {

        if (this.x < this.game.world.bounds.x)
        {
            this.x = this.game.world.bounds.x;
            this.velocity.x *= -this.bounce.x;
        }
        else if (this.right > this.game.world.bounds.right)
        {
            this.x = this.game.world.bounds.right - this.width;
            this.velocity.x *= -this.bounce.x;
        }

        if (this.y < this.game.world.bounds.y)
        {
            this.y = this.game.world.bounds.y;
            this.velocity.y *= -this.bounce.y;
        }
        else if (this.bottom > this.game.world.bounds.bottom)
        {
            this.y = this.game.world.bounds.bottom - this.height;
            this.velocity.y *= -this.bounce.y;
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
        return this.position.x - this.prev.x;
    },

    /**
    * Returns the delta y value. The difference between Body.y now and in the previous step.
    *
    * @method Phaser.Physics.Arcade.Body#deltaY
    * @return {number} The delta value. Positive if the motion was downwards, negative if upwards.
    */
    deltaY: function () {
        return this.position.y - this.prev.y;
    },

    /**
    * Returns the delta z value. The difference between Body.rotation now and in the previous step.
    *
    * @method Phaser.Physics.Arcade.Body#deltaZ
    * @return {number} The delta value. Positive if the motion was clockwise, negative if anti-clockwise.
    */
    deltaZ: function () {
        return this.rotation - this.preRotation;
    }

};

/**
* @name Phaser.Physics.Arcade.Body#bottom
* @property {number} bottom - The bottom value of this Body (same as Body.y + Body.height)
* @readonly
*/
Object.defineProperty(Phaser.Physics.Arcade.Body.prototype, "bottom", {
    
    /**
    * The sum of the y and height properties.
    * @method bottom
    * @return {number}
    * @readonly
    */
    get: function () {
        return this.position.y + this.height;
    }

});

/**
* @name Phaser.Physics.Arcade.Body#right
* @property {number} right - The right value of this Body (same as Body.x + Body.width)
* @readonly
*/
Object.defineProperty(Phaser.Physics.Arcade.Body.prototype, "right", {
    
    /**
    * The sum of the x and width properties.
    * @method right
    * @return {number}
    * @readonly
    */
    get: function () {
        return this.position.x + this.width;
    }

});

/**
* @name Phaser.Physics.Arcade.Body#x
* @property {number} x - The x position.
*/
Object.defineProperty(Phaser.Physics.Arcade.Body.prototype, "x", {
    
    /**
    * The x position.
    * @method x
    * @return {number}
    */
    get: function () {
        return this.position.x;
    },

    /**
    * The x position.
    * @method x
    * @param {number} value
    */
    set: function (value) {
        this.position.x = value;
    }

});

/**
* @name Phaser.Physics.Arcade.Body#y
* @property {number} y - The y position.
*/
Object.defineProperty(Phaser.Physics.Arcade.Body.prototype, "y", {
    
    /**
    * The y position.
    * @method y
    * @return {number}
    */
    get: function () {
        return this.position.y;
    },

    /**
    * The y position.
    * @method y
    * @param {number} value
    */
    set: function (value) {
        this.position.y = value;
    }

});

Phaser.Physics.Arcade.Body.prototype.constructor = Phaser.Physics.Arcade.Body;
