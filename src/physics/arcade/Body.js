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
    * @property {Phaser.Point} acceleration - The velocity in pixels per second sq. of the Body.
    */
    this.acceleration = new Phaser.Point();

    /**
    * @property {Phaser.Point} drag - The drag applied to the motion of the Body.
    */
    this.drag = new Phaser.Point();

    /**
    * @property {Phaser.Point} gravity - A private Gravity setting for the Body.
    */
    this.gravity = new Phaser.Point();

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
    * @property {boolean} skipQuadTree - If the Body is an irregular shape you can set this to true to avoid it being added to the World quad tree.
    * @default
    */
    this.skipQuadTree = false;

    /**
    * @property {Array} quadTreeIDs - Internal ID cache.
    * @protected
    */
    this.quadTreeIDs = [];

    /**
    * @property {number} quadTreeIndex - Internal ID cache.
    * @protected
    */
    this.quadTreeIndex = -1;

    //  Allow collision

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
    * This object is populated with previous touching values from the bodies previous collision.
    * @property {object} wasTouching - An object containing previous touching results.
    */
    this.wasTouching = { none: true, up: false, down: false, left: false, right: false };

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
    * @property {boolean} allowGravity - Allow this Body to be influenced by the global Gravity?
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
    * @property {Phaser.Rectangle} hullX - The dynamically calculated hull used during collision.
    */
    this.hullX = new Phaser.Rectangle();

    /**
    * @property {Phaser.Rectangle} hullY - The dynamically calculated hull used during collision.
    */
    this.hullY = new Phaser.Rectangle();

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

        this.screenX = (this.sprite.worldTransform[2] - (this.sprite.anchor.x * this.width)) + this.offset.x;
        this.screenY = (this.sprite.worldTransform[5] - (this.sprite.anchor.y * this.height)) + this.offset.y;

        this.preX = (this.sprite.world.x - (this.sprite.anchor.x * this.width)) + this.offset.x;
        this.preY = (this.sprite.world.y - (this.sprite.anchor.y * this.height)) + this.offset.y;

        this.preRotation = this.sprite.angle;

        this.x = this.preX;
        this.y = this.preY;
        this.rotation = this.preRotation;

        if (this.moves)
        {
            this.game.physics.updateMotion(this);

            if (this.collideWorldBounds)
            {
                this.checkWorldBounds();
            }

            this.updateHulls();
        }

        if (this.skipQuadTree === false && this.allowCollision.none === false && this.sprite.visible && this.sprite.alive)
        {
            this.quadTreeIDs = [];
            this.quadTreeIndex = -1;
            this.game.physics.quadTree.insert(this);
        }

    },

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade#postUpdate
    * @protected
    */
    postUpdate: function () {

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
            this.sprite.x += this.deltaX();
            this.sprite.y += this.deltaY();
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
    * @method Phaser.Physics.Arcade#updateHulls
    * @protected
    */
    updateHulls: function () {

        this.hullX.setTo(this.x, this.preY, this.width, this.height);
        this.hullY.setTo(this.preX, this.y, this.width, this.height);

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
    * @return {number} The delta value.
    */
    deltaX: function () {
        return this.x - this.preX;
    },

    /**
    * Returns the delta y value. The difference between Body.y now and in the previous step.
    *
    * @method Phaser.Physics.Arcade.Body#deltaY
    * @return {number} The delta value.
    */
    deltaY: function () {
        return this.y - this.preY;
    },

    deltaZ: function () {
        return this.rotation - this.preRotation;
    }

};

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
