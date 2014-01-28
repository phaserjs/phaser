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
    * @property {Phaser.Point} minVelocity - When a body rebounds off another or a wall the minVelocity is checked. If the new velocity is lower than minVelocity the body is stopped.
    * @default
    */
    this.minVelocity = new Phaser.Point(5, 5);

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
    this.friction = 0.1;

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
    * This object is populated with boolean values when the Body collides with the World bounds or a Tile.
    * For example if blocked.up is true then the Body cannot move up.
    * @property {object} blocked - An object containing on which faces this Body is blocked from moving, if any.
    */
    this.blocked = { up: false, down: false, left: false, right: false };

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

    this.blockFlags = [0, 0, 0, 0];

    this.overlapX = 0;
    this.overlapY = 0;

    //  Set-up the default shape
    this.setRectangle(sprite.width, sprite.height, -sprite._cache.halfWidth, -sprite._cache.halfHeight);

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

        if (typeof offsetX === 'undefined') { offsetX = 0; }
        if (typeof offsetY === 'undefined') { offsetY = 0; }

        this.type = Phaser.Physics.Arcade.CIRCLE;
        this.shape = new SAT.Circle(new SAT.Vector(this.sprite.center.x, this.sprite.center.y), radius);
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
        this.shape = new SAT.Box(new SAT.Vector(this.sprite.center.x, this.sprite.center.y), width, height);
        this.polygon = this.shape.toPolygon();
        this.polygon.translate(translateX, translateY);

        this.offset.setTo(0, 0);

    },

    /**
    * Sets this Body to use a convex polygon for all collision. The points are specified in a counter-clockwise direction and must create a convex polygon.
    * It will be centered on the parent Sprite.
    *
    * @method Phaser.Physics.Arcade#setPolygon
    * @param {array<SAT.Vector>} points - An array of vectors representing the points in the polygon, in counter-clockwise order.
    * @param {number} [translateX=0] - The x amount the rectangle will be translated by from the Sprites center.
    * @param {number} [translateY=0] - The y amount the rectangle will be translated by from the Sprites center.
    */
    setPolygon: function (points, translateX, translateY) {

        if (typeof translateX === 'undefined') { translateX = 0; }
        if (typeof translateY === 'undefined') { translateY = 0; }

        this.type = Phaser.Physics.Arcade.POLYGON;
        this.shape = null;
        this.polygon = new SAT.Polygon(new SAT.Vector(this.sprite.center.x, this.sprite.center.y), points);
        this.polygon.translate(translateX, translateY);

        this.offset.setTo(0, 0);

    },

    /**
    * Internal method.
    *
    * @method Phaser.Physics.Arcade#updateScale
    * @private
    */
    updateScale: function (scaleX, scaleY) {

        if (scaleX != this._sx || scaleY != this._sy)
        {
            if (this.polygon)
            {
                this.polygon.scale(scaleX / this._sx, scaleY / this._sy);
            }
            else
            {
                this.shape.r *= Math.max(scaleX, scaleY);
            }

            this._sx = scaleX;
            this._sy = scaleY;
        }

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

        this.x = this.sprite.center.x + this.offset.x;
        this.y = this.sprite.center.y + this.offset.y;

        if (this.allowRotation)
        {
            this.preRotation = this.rotation;
            this.rotation = this.sprite.rotation;

            if (this.type !== Phaser.Physics.Arcade.CIRCLE && this.deltaZ() !== 0)
            {
                this.polygon.rotate(this.deltaZ());
            }
        }

        this.updateBounds();

        if (this.blocked.left && this.blockFlags[0] !== this.left)
        {
            this.blocked.left = false;
        }

        if (this.blocked.right && this.blockFlags[1] !== this.right)
        {
            this.blocked.right = false;
        }

        if (this.blocked.up && this.blockFlags[2] !== this.top)
        {
            this.blocked.up = false;
        }

        if (this.blocked.down && this.blockFlags[3] !== this.bottom)
        {
            console.log('reset down block flag', this.blockFlags[3], this.bottom);
            this.blocked.down = false;
        }

        this.touching.none = true;
        this.touching.up = false;
        this.touching.down = false;
        this.touching.left = false;
        this.touching.right = false;

        this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        this.angle = Math.atan2(this.velocity.y, this.velocity.x);

        if (this.moves)
        {
            this.game.physics.checkBounds(this);

            this.applyFriction();
        }

    },

    setBlockFlag: function (left, right, up, down, x, y) {

        if (left)
        {
            this.blockFlags[0] = this.left + x;
            console.log('left flag set to', this.blockFlags[0]);
        }
        else if (right)
        {
            this.blockFlags[1] = this.right + y;
            console.log('right flag set to', this.blockFlags[1]);
        }

        if (up)
        {
            this.blockFlags[2] = this.top + y;
            // this.blockFlags[2] = this.top;
            console.log('up flag set to', this.blockFlags[2]);
        }
        else if (down)
        {
            this.blockFlags[3] = this.bottom + y;
            // this.blockFlags[3] = this.bottom;
            console.log('down flag set to', this.blockFlags[3]);
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
            this.left = this.polygon.pos.x - this.polygon.points[0].x;
            this.right = this.polygon.pos.x + this.polygon.points[0].x;
            this.top = this.polygon.pos.y - this.polygon.points[0].y;
            this.bottom = this.polygon.pos.y + this.polygon.points[0].y;

            var temp;

            for (var i = 1, len = this.polygon.points.length; i < len; i++)
            {
                //  Left
                temp = this.polygon.pos.x - this.polygon.points[i].x;

                if (temp < this.left)
                {
                    this.left = temp;
                }

                //  Right
                temp = this.polygon.pos.x + this.polygon.points[i].x;

                if (temp > this.right)
                {
                    this.right = temp;
                }

                //  Top
                temp = this.polygon.pos.y - this.polygon.points[i].y;

                if (temp < this.top)
                {
                    this.top = temp;
                }

                //  Bottom
                temp = this.polygon.pos.y + this.polygon.points[i].y;

                if (temp > this.bottom)
                {
                    this.bottom = temp;
                }
            }

            this.width = this.right - this.left;
            this.height = this.bottom - this.top;

        }

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

            this.velocity.x = Math.cos(this.angle) * this.speed;
            this.velocity.y = Math.sin(this.angle) * this.speed;
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

        if (x)
        {
            if (rebound && (this.blocked.left || this.blocked.right))
            {
                this.velocity.x *= -this.bounce.x;
            }

            var gx = this.getTotalGravityX();
    
            if (Math.abs(this.velocity.x) < this.minVelocity.x && (this.blocked.left && gx < 0 || this.blocked.right && gx > 0))
            {
                this.velocity.x = 0;
            }
        }

        if (y)
        {
            if (rebound && this.bounce.y && (this.blocked.up || this.blocked.down))
            {
                this.velocity.y *= -this.bounce.y;
            }

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

        if (this.type === Phaser.Physics.Arcade.RECT && body.type === Phaser.Physics.Arcade.RECT)
        {
            return SAT.testPolygonPolygon(this.polygon, body.polygon, response);
        }
        else if (this.type === Phaser.Physics.Arcade.CIRCLE && body.type === Phaser.Physics.Arcade.CIRCLE)
        {
            return SAT.testCircleCircle(this.shape, body.shape, response);
        }
        else if (this.type === Phaser.Physics.Arcade.RECT && body.type === Phaser.Physics.Arcade.CIRCLE)
        {
            return SAT.testPolygonCircle(this.polygon, body.shape, response);
        }
        else if (this.type === Phaser.Physics.Arcade.CIRCLE && body.type === Phaser.Physics.Arcade.RECT)
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

        console.log(this.sprite.name, 'collided with', body.sprite.name, response);

        this._distances[0] = body.right - this.x;   // Distance of B to face on left side of A
        this._distances[1] = this.right - body.x;   // Distance of B to face on right side of A
        this._distances[2] = body.bottom - this.y;  // Distance of B to face on bottom side of A
        this._distances[3] = this.bottom - body.y;  // Distance of B to face on top side of A

        if (response.overlapN.x)
        {
            //  Which is smaller? Left or Right?
            if (this._distances[0] < this._distances[1])
            {
                console.log(this.sprite.name, 'collided on the LEFT with', body.sprite.name, response);
                this.hitLeft(body, response);
            }
            else if (this._distances[1] < this._distances[0])
            {
                console.log(this.sprite.name, 'collided on the RIGHT with', body.sprite.name, response);
                this.hitRight(body, response);
            }
        }
        else if (response.overlapN.y)
        {
            //  Which is smaller? Top or Bottom?
            if (this._distances[2] < this._distances[3])
            {
                console.log(this.sprite.name, 'collided on the TOP with', body.sprite.name, response);
                this.hitTop(body, response);
            }
            else if (this._distances[3] < this._distances[2])
            {
                console.log(this.sprite.name, 'collided on the BOTTOM with', body.sprite.name, response);
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
        if (body.speed > 0 && (body.deltaX() <= 0 || (body.deltaX() > 0 && !this.checkCollision.left)))
        {
            return;
        }

        if (this.collideCallback && !this.collideCallback.call(this.collideCallbackContext, Phaser.LEFT, this, body, response))
        {
            return;
        }

        if (this.immovable || this.blocked.right || this.touching.right)
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
        if (body.speed > 0 && (body.deltaX() >= 0 || (body.deltaX() < 0 && !this.checkCollision.right)))
        {
            console.log('bail 1', body.deltaX());
            return;
        }

        if (this.collideCallback && !this.collideCallback.call(this.collideCallbackContext, Phaser.RIGHT, this, body))
        {
            console.log('bail 2');
            return;
        }

        if (this.immovable || this.blocked.left || this.touching.left)
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
        if (body.speed > 0 && (body.deltaY() <= 0 || (body.deltaY() > 0 && !this.checkCollision.up)))
        {
            return;
        }

        if (this.collideCallback && !this.collideCallback.call(this.collideCallbackContext, Phaser.UP, this, body))
        {
            return;
        }

        if (this.immovable || this.blocked.down || this.touching.down)
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
        if (body.speed > 0 && (body.deltaY() >= 0 || (body.deltaY() < 0 && !this.checkCollision.down)))
        {
            return;
        }

        if (this.collideCallback && !this.collideCallback.call(this.collideCallbackContext, Phaser.DOWN, this, body))
        {
            return;
        }

        if (this.immovable || this.blocked.up || this.touching.up)
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

        //  positive = RIGHT / DOWN
        //  negative = LEFT / UP

        if ((this._dx < 0 && !this.blocked.left && !this.touching.left) || (this._dx > 0 && !this.blocked.right && !this.touching.right))
        {
            this.x += this._dx;
            this.velocity.x += this._temp.x;
        }

        if ((this._dy < 0 && !this.blocked.up && !this.touching.up) || (this._dy > 0 && !this.blocked.down && !this.touching.down))
        {
            this.y += this._dy;
            this.velocity.y += this._temp.y;
            // console.log('y added', this._dy);
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

            this.integrateVelocity();

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

            this.sprite.x = this.x + (this.sprite.x - this.sprite.center.x) - this.offset.x;
            this.sprite.y = this.y + (this.sprite.y - this.sprite.center.y) - this.offset.y;

            if (this.allowRotation)
            {
                // this.sprite.rotation = this.rotation;
                // this.sprite.angle += this.deltaZ();
                // this.sprite.angle = this.angle;
            }
        }

    },

    /**
    * Resets the Body motion values: velocity, acceleration, angularVelocity and angularAcceleration.
    * Also resets the forces to defaults: gravity, bounce, minVelocity,maxVelocity, angularDrag, maxAngular, mass, friction and checkCollision.
    *
    * @method Phaser.Physics.Arcade#reset
    */
    reset: function () {

        this.velocity.setTo(0, 0);
        this.acceleration.setTo(0, 0);
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.gravity.setTo(0, 0);
        this.bounce.setTo(0, 0);
        this.minVelocity.setTo(5, 5);
        this.maxVelocity.setTo(1000, 1000);
        this.angularDrag = 0;
        this.maxAngular = 1000;
        this.mass = 1;
        this.friction = 0.1;
        this.checkCollision = { none: false, any: true, up: true, down: true, left: true, right: true };

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

    }

});

/**
* @name Phaser.Physics.Arcade.Body#movingLeft
* @property {number} movingLeft
*/
Object.defineProperty(Phaser.Physics.Arcade.Body.prototype, "movingLeft", {
    
    /**
    * @method movingLeft
    * @return {boolean}
    */
    get: function () {
    }

});
