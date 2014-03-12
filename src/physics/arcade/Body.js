/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Physics Body is linked to a single Sprite and defines properties that determine how the physics body is simulated.
* These properties affect how the body reacts to forces, what forces it generates on itself (to simulate friction), and how it reacts to collisions in the scene. In most cases, the properties are used to simulate physical effects.
* Each body also has its own property values that determine exactly how it reacts to forces and collisions in the scene.
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
    * @property {Phaser.Point} bounce - The elasticitiy of the Body when colliding. This property determines how much energy a body maintains during a collision, i.e. its bounciness.
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
    * @property {number} angularDrag - angularDrag is used to calculate friction on the body as it rotates.
    * @default
    */
    this.angularDrag = 0;

    /**
    * @property {number} maxAngular - The maximum angular velocity that the Body can reach.
    * @default
    */
    this.maxAngular = 1000;

    /**
    * @property {number} mass - The mass property determines how forces affect the body, as well as how much momentum the body has when it is involved in a collision.
    * @default
    */
    this.mass = 1;

    /**
    * @property {number} linearDamping - linearDamping is used to calculate friction on the body as it moves through the world. For example, this might be used to simulate air or water friction.
    * @default
    */
    this.linearDamping = 0.0;

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
    * @property {array<Phaser.Physics.Arcade.Body>} contacts - Used to store references to bodies this Body is in contact with.
    * @protected
    */
    this.contacts = [];

    /**
    * @property {number} overlapX - Mostly used internally to store the overlap values from Tile seperation.
    * @protected
    */
    this.overlapX = 0;

    /**
    * @property {number} overlapY - Mostly used internally to store the overlap values from Tile seperation.
    * @protected
    */
    this.overlapY = 0;

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

    /**
    * @property {number} _vx - Internal cache var.
    * @private
    */
    this._vx = 0;

    /**
    * @property {number} _vy - Internal cache var.
    * @private
    */
    this._vy = 0;

    //  Set-up the default shape
    this.setRectangle(sprite.width, sprite.height, 0, 0);

    //  Set-up contact events
    this.sprite.events.onBeginContact = new Phaser.Signal();
    this.sprite.events.onEndContact = new Phaser.Signal();

};

Phaser.Physics.Arcade.Body.prototype = {

    /**
    * Internal method that updates the Body scale in relation to the parent Sprite.
    *
    * @method Phaser.Physics.Arcade.Body#updateScale
    * @protected
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

    },

    /**
    * Internal method that updates the Body position in relation to the parent Sprite.
    *
    * @method Phaser.Physics.Arcade.Body#preUpdate
    * @protected
    */
    preUpdate: function () {

        this.x = (this.sprite.world.x - (this.sprite.anchor.x * this.sprite.width)) + this.offset.x;
        this.y = (this.sprite.world.y - (this.sprite.anchor.y * this.sprite.height)) + this.offset.y;

        //  This covers any motion that happens during this frame, not since the last frame
        this.preX = this.x;
        this.preY = this.y;
        this.preRotation = this.sprite.angle;

        this.rotation = this.preRotation;

        if (this.sprite.scale.x !== this._sx || this.sprite.scale.y !== this._sy)
        {
            this.updateScale();
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
            }

            if (this.game.physics.checkBounds(this))
            {
                this.reboundCheck(true, true, true);
            }

            this.applyDamping();

            this.integrateVelocity();

            this.updateBounds();

            this.checkBlocked();
        }
        else
        {
            this.updateBounds();
        }

    },

    /**
    * Internal method that checks and potentially resets the blocked status flags.
    *
    * @method Phaser.Physics.Arcade.Body#checkBlocked
    * @protected
    */
    checkBlocked: function () {

        if ((this.blocked.left || this.blocked.right) && (Math.floor(this.x) !== this.blocked.x || Math.floor(this.y) !== this.blocked.y))
        {
            this.blocked.left = false;
            this.blocked.right = false;
        }

        if ((this.blocked.up || this.blocked.down) && (Math.floor(this.x) !== this.blocked.x || Math.floor(this.y) !== this.blocked.y))
        {
            this.blocked.up = false;
            this.blocked.down = false;
        }

    },

    /**
    * Internal method that updates the left, right, top, bottom, width and height properties.
    *
    * @method Phaser.Physics.Arcade.Body#updateBounds
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
    * Internal method that checks the acceleration and applies damping if not set.
    *
    * @method Phaser.Physics.Arcade.Body#applyDamping
    * @protected
    */
    applyDamping: function () {

        if (this.linearDamping > 0 && this.acceleration.isZero())
        {
            if (this.speed > this.linearDamping)
            {
                this.speed -= this.linearDamping;
            }
            else
            {
                this.speed = 0;
            }

            if (this.speed > 0 || !this.velocity.isZero())
            {
                this.velocity.x = Math.cos(this.angle) * this.speed;
                this.velocity.y = Math.sin(this.angle) * this.speed;

                this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                this.angle = Math.atan2(this.velocity.y, this.velocity.x);
            }
        }

    },

    /**
    * Check if we're below minVelocity and gravity isn't trying to drag us in the opposite direction.
    *
    * @method Phaser.Physics.Arcade.Body#reboundCheck
    * @protected
    * @param {boolean} x - Check the X axis?
    * @param {boolean} y - Check the Y axis?
    * @param {boolean} rebound - If true it will reverse the velocity on the given axis
    */
    reboundCheck: function (x, y, rebound) {

        if (x)
        {
            if (rebound && this.bounce.x !== 0 && (this.blocked.left || this.blocked.right || this.touching.left || this.touching.right))
            {
                //  Don't rebound if they've already rebounded in this frame
                if (!(this._vx <= 0 && this.velocity.x > 0) && !(this._vx >= 0 && this.velocity.x < 0))
                {
                    this.velocity.x *= -this.bounce.x;
                    this.angle = Math.atan2(this.velocity.y, this.velocity.x);
                }
            }

            if (this.bounce.x === 0 || Math.abs(this.velocity.x) < this.minVelocity.x)
            {
                var gx = this.getUpwardForce();

                if (((this.blocked.left || this.touching.left) && (gx < 0 || this.velocity.x < 0)) || ((this.blocked.right || this.touching.right) && (gx > 0 || this.velocity.x > 0)))
                {
                    this.velocity.x = 0;
                }
            }
        }

        if (y)
        {
            if (rebound && this.bounce.y !== 0 && (this.blocked.up || this.blocked.down || this.touching.up || this.touching.down))
            {
                //  Don't rebound if they've already rebounded in this frame
                if (!(this._vy <= 0 && this.velocity.y > 0) && !(this._vy >= 0 && this.velocity.y < 0))
                {
                    this.velocity.y *= -this.bounce.y;
                    this.angle = Math.atan2(this.velocity.y, this.velocity.x);
                }
            }

            if (this.bounce.y === 0 || Math.abs(this.velocity.y) < this.minVelocity.y)
            {
                var gy = this.getDownwardForce();

                if (((this.blocked.up || this.touching.up) && (gy < 0 || this.velocity.y < 0)) || ((this.blocked.down || this.touching.down) && (gy > 0 || this.velocity.y > 0)))
                {
                    this.velocity.y = 0;
                }
            }
        }

    },

    /**
    * Gets the total force being applied on the X axis, including gravity and velocity.
    *
    * @method Phaser.Physics.Arcade.Body#getUpwardForce
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
    * @method Phaser.Physics.Arcade.Body#getDownwardForce
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
    * @method Phaser.Physics.Arcade.Body#sub
    * @protected
    * @param {SAT.Vector} v - The vector to substract from this Body.
    */
    sub: function (v) {

        this.x -= v.x;
        this.y -= v.y;

    },

    /**
    * Adds the given Vector to this Body.
    *
    * @method Phaser.Physics.Arcade.Body#add
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
    * @method Phaser.Physics.Arcade.Body#give
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
    * @method Phaser.Physics.Arcade.Body#take
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
    * @method Phaser.Physics.Arcade.Body#split
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
    * @method Phaser.Physics.Arcade.Body#exchange
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
    * @method Phaser.Physics.Arcade.Body#processRebound
    * @protected
    * @param {Phaser.Physics.Arcade.Body} body - The Body that collided.
    */
    processRebound: function (body) {

        //  Don't rebound again if they've already rebounded in this frame
        if (!(this._vx <= 0 && this.velocity.x > 0) && !(this._vx >= 0 && this.velocity.x < 0))
        {
            this.velocity.x = body.velocity.x - this.velocity.x * this.bounce.x;
        }

        if (!(this._vy <= 0 && this.velocity.y > 0) && !(this._vy >= 0 && this.velocity.y < 0))
        {
            this.velocity.y = body.velocity.y - this.velocity.y * this.bounce.y;
        }

        this.angle = Math.atan2(this.velocity.y, this.velocity.x);

        this.reboundCheck(true, true, false);

    },

    /**
    * Checks for an overlap between this Body and the given Body.
    *
    * @method Phaser.Physics.Arcade.Body#overlap
    * @param {Phaser.Physics.Arcade.Body} body - The Body that is being checked against this Body.
    * @param {SAT.Response} response - SAT Response handler.
    * @return {boolean} True if the two bodies overlap, otherwise false.
    */
    overlap: function (body, response) {

        var result = false;

        if ((this.type === Phaser.Physics.Arcade.RECT || this.type === Phaser.Physics.Arcade.POLYGON) && (body.type === Phaser.Physics.Arcade.RECT || body.type === Phaser.Physics.Arcade.POLYGON))
        {
            result = SAT.testPolygonPolygon(this.polygon, body.polygon, response);
        }
        else if (this.type === Phaser.Physics.Arcade.CIRCLE && body.type === Phaser.Physics.Arcade.CIRCLE)
        {
            result = SAT.testCircleCircle(this.shape, body.shape, response);
        }
        else if ((this.type === Phaser.Physics.Arcade.RECT || this.type === Phaser.Physics.Arcade.POLYGON) && body.type === Phaser.Physics.Arcade.CIRCLE)
        {
            result = SAT.testPolygonCircle(this.polygon, body.shape, response);
        }
        else if (this.type === Phaser.Physics.Arcade.CIRCLE && (body.type === Phaser.Physics.Arcade.RECT || body.type === Phaser.Physics.Arcade.POLYGON))
        {
            result = SAT.testCirclePolygon(this.shape, body.polygon, response);
        }

        if (!result)
        {
            this.removeContact(body);
        }

        return result;

    },

    /**
    * Checks if this Body is already in contact with the given Body.
    *
    * @method Phaser.Physics.Arcade.Body#inContact
    * @param {Phaser.Physics.Arcade.Body} body - The Body to be checked.
    * @return {boolean} True if the given Body is already in contact with this Body.
    */
    inContact: function (body) {

        return (this.contacts.indexOf(body) != -1);

    },

    /**
    * Adds the given Body to the contact list of this Body. Also adds this Body to the contact list of the given Body.
    *
    * @method Phaser.Physics.Arcade.Body#addContact
    * @param {Phaser.Physics.Arcade.Body} body - The Body to be added.
    * @return {boolean} True if the given Body was added to this contact list, false if already on it.
    */
    addContact: function (body) {

        if (this.inContact(body))
        {
            return false;
        }

        this.contacts.push(body);

        this.sprite.events.onBeginContact.dispatch(this.sprite, body.sprite, this, body);

        body.addContact(this);

        return true;

    },

    /**
    * Removes the given Body from the contact list of this Body. Also removes this Body from the contact list of the given Body.
    *
    * @method Phaser.Physics.Arcade.Body#removeContact
    * @param {Phaser.Physics.Arcade.Body} body - The Body to be removed.
    * @return {boolean} True if the given Body was removed from this contact list, false if wasn't on it.
    */
    removeContact: function (body) {

        if (!this.inContact(body))
        {
            return false;
        }

        this.contacts.splice(this.contacts.indexOf(body), 1);

        this.sprite.events.onEndContact.dispatch(this.sprite, body.sprite, this, body);

        body.removeContact(this);

        return true;

    },

    /**
    * This separates this Body from the given Body unless a customSeparateCallback is set.
    * It assumes they have already been overlap checked and the resulting overlap is stored in the SAT response.
    *
    * @method Phaser.Physics.Arcade.Body#separate
    * @protected
    * @param {Phaser.Physics.Arcade.Body} body - The Body to be separated from this one.
    * @param {SAT.Response} response - SAT Response handler.
    * @return {boolean} True if the bodies were separated, false if not (for example checkCollide allows them to pass through)
    */
    separate: function (body, response) {

        // if (this.inContact(body))
        // {
            // return false;
        // }

        this._distances[0] = body.right - this.x;   // Distance of B to face on left side of A
        this._distances[1] = this.right - body.x;   // Distance of B to face on right side of A
        this._distances[2] = body.bottom - this.y;  // Distance of B to face on bottom side of A
        this._distances[3] = this.bottom - body.y;  // Distance of B to face on top side of A

        //  If we've zero distance then check for side-slicing
        if (response.overlapN.x && (this._distances[0] === 0 || this._distances[1] === 0))
        {
            response.overlapN.x = false;
            response.overlapN.y = true;
        }
        else if (response.overlapN.y && (this._distances[2] === 0 || this._distances[3] === 0))
        {
            response.overlapN.x = true;
            response.overlapN.y = false;
        }

        if (this.customSeparateCallback)
        {
            return this.customSeparateCallback.call(this.customSeparateContext, this, response, this._distances);
        }

        var hasSeparated = false;

        if (response.overlapN.x)
        {
            //  Which is smaller? Left or Right?
            if (this._distances[0] < this._distances[1])
            {
                hasSeparated = this.hitLeft(body, response);
            }
            else if (this._distances[1] < this._distances[0])
            {
                hasSeparated = this.hitRight(body, response);
            }
        }
        else if (response.overlapN.y)
        {
            //  Which is smaller? Top or Bottom?
            if (this._distances[2] < this._distances[3])
            {
                hasSeparated = this.hitTop(body, response);
            }
            else if (this._distances[3] < this._distances[2])
            {
                hasSeparated = this.hitBottom(body, response);
            }
        }

        if (hasSeparated)
        {
            this.game.physics.checkBounds(this);
            this.game.physics.checkBounds(body);
        }
        else
        {
            //  They can only contact like this if at least one of their sides is open, otherwise it's a separation
            if (!this.checkCollision.up || !this.checkCollision.down || !this.checkCollision.left || !this.checkCollision.right || !body.checkCollision.up || !body.checkCollision.down || !body.checkCollision.left || !body.checkCollision.right)
            {
                this.addContact(body);
            }
        }

        return hasSeparated;

    },

    /**
    * Process a collision with the left face of this Body.
    * Collision and separation can be further checked by setting a collideCallback.
    * This callback will be sent 4 parameters: The face of collision, this Body, the colliding Body and the SAT Response.
    * If the callback returns true then separation, rebounds and the touching flags will all be set.
    * If it returns false this will be skipped and must be handled manually.
    *
    * @method Phaser.Physics.Arcade.Body#hitLeft
    * @protected
    * @param {Phaser.Physics.Arcade.Body} body - The Body that collided.
    * @param {SAT.Response} response - The SAT Response object containing the collision data.
    */
    hitLeft: function (body, response) {

        if (!this.checkCollision.left || !body.checkCollision.right)
        {
            return false;
        }

        if (this.collideCallback && !this.collideCallback.call(this.collideCallbackContext, Phaser.LEFT, this, body, response))
        {
            return false;
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
        this.touching.none = false;
        body.touching.right = true;
        body.touching.none = false;

        return true;

    },

    /**
    * Process a collision with the right face of this Body.
    * Collision and separation can be further checked by setting a collideCallback.
    * This callback will be sent 4 parameters: The face of collision, this Body, the colliding Body and the SAT Response.
    * If the callback returns true then separation, rebounds and the touching flags will all be set.
    * If it returns false this will be skipped and must be handled manually.
    *
    * @method Phaser.Physics.Arcade.Body#hitRight
    * @protected
    * @param {Phaser.Physics.Arcade.Body} body - The Body that collided.
    * @param {SAT.Response} response - The SAT Response object containing the collision data.
    */
    hitRight: function (body, response) {

        if (!this.checkCollision.right || !body.checkCollision.left)
        {
            return false;
        }

        if (this.collideCallback && !this.collideCallback.call(this.collideCallbackContext, Phaser.RIGHT, this, body))
        {
            return false;
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
        this.touching.none = false;
        body.touching.left = true;
        body.touching.none = false;

        return true;

    },

    /**
    * Process a collision with the top face of this Body.
    * Collision and separation can be further checked by setting a collideCallback.
    * This callback will be sent 4 parameters: The face of collision, this Body, the colliding Body and the SAT Response.
    * If the callback returns true then separation, rebounds and the touching flags will all be set.
    * If it returns false this will be skipped and must be handled manually.
    *
    * @method Phaser.Physics.Arcade.Body#hitTop
    * @protected
    * @param {Phaser.Physics.Arcade.Body} body - The Body that collided.
    * @param {SAT.Response} response - The SAT Response object containing the collision data.
    */
    hitTop: function (body, response) {

        if (!this.checkCollision.up || !body.checkCollision.down)
        {
            return false;
        }

        if (this.collideCallback && !this.collideCallback.call(this.collideCallbackContext, Phaser.UP, this, body))
        {
            return false;
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
        this.touching.none = false;
        body.touching.down = true;
        body.touching.none = false;

        return true;

    },

    /**
    * Process a collision with the bottom face of this Body.
    * Collision and separation can be further checked by setting a collideCallback.
    * This callback will be sent 4 parameters: The face of collision, this Body, the colliding Body and the SAT Response.
    * If the callback returns true then separation, rebounds and the touching flags will all be set.
    * If it returns false this will be skipped and must be handled manually.
    *
    * @method Phaser.Physics.Arcade.Body#hitBottom
    * @protected
    * @param {Phaser.Physics.Arcade.Body} body - The Body that collided.
    * @param {SAT.Response} response - The SAT Response object containing the collision data.
    */
    hitBottom: function (body, response) {

        if (!this.checkCollision.down || !body.checkCollision.up)
        {
            return false;
        }

        if (this.collideCallback && !this.collideCallback.call(this.collideCallbackContext, Phaser.DOWN, this, body))
        {
            return false;
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
        this.touching.none = false;
        body.touching.up = true;
        body.touching.none = false;

        return true;

    },

    /**
    * Internal method. Integrates velocity, global gravity and the delta timer.
    *
    * @method Phaser.Physics.Arcade.Body#integrateVelocity
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
    * @method Phaser.Physics.Arcade.Body#postUpdate
    * @protected
    */
    postUpdate: function () {

        if (this.moves)
        {
            this.game.physics.checkBounds(this);

            this.reboundCheck(true, true, true);

            this._dx = this.deltaX();
            this._dy = this.deltaY();

            if (this._dx < 0)
            {
                this.facing = Phaser.LEFT;
            }
            else if (this._dx > 0)
            {
                this.facing = Phaser.RIGHT;
            }

            if (this._dy < 0)
            {
                this.facing = Phaser.UP;
            }
            else if (this._dy > 0)
            {
                this.facing = Phaser.DOWN;
            }

            if (this._dx !== 0 || this._dy !== 0)
            {
                this.sprite.x += this._dx;
                this.sprite.y += this._dy;
            }

            if (this.allowRotation && this.deltaZ() !== 0)
            {
                this.sprite.angle += this.deltaZ();
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
    * @method Phaser.Physics.Arcade.Body#reset
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
        this.preX = this.x;
        this.preY = this.y;
        this.updateBounds();

        this.contacts.length = 0;

    },

    /**
    * Destroys this Body and all references it holds to other objects.
    *
    * @method Phaser.Physics.Arcade.Body#destroy
    */
    destroy: function () {

        this.sprite = null;

        this.collideCallback = null;
        this.collideCallbackContext = null;

        this.customSeparateCallback = null;
        this.customSeparateContext = null;

        this.contacts.length = 0;

    },

    /**
    * Sets this Body to use a circle of the given radius for all collision.
    * The Circle will be centered on the center of the Sprite by default, but can be adjusted via the Body.offset property and the setCircle x/y parameters.
    *
    * @method Phaser.Physics.Arcade.Body#setCircle
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
    * @method Phaser.Physics.Arcade.Body#setRectangle
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
    * @method Phaser.Physics.Arcade.Body#setPolygon
    * @param {(SAT.Vector[]|number[]|...SAT.Vector|...number)} points - This can be an array of Vectors that form the polygon,
    *      a flat array of numbers that will be interpreted as [x,y, x,y, ...], or the arguments passed can be
    *      all the points of the polygon e.g. `setPolygon(new SAT.Vector(), new SAT.Vector(), ...)`, or the
    *      arguments passed can be flat x,y values e.g. `setPolygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers.
    */
    setPolygon: function (points) {

        this.type = Phaser.Physics.Arcade.POLYGON;
        this.shape = null;

        if (!Array.isArray(points))
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
    * @method Phaser.Physics.Arcade.Body#translate
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
    * Determines if this Body is 'on the floor', which means in contact with a Tile or World bounds, or other object that has set 'down' as blocked.
    *
    * @method Phaser.Physics.Arcade.Body#onFloor
    * @return {boolean} True if this Body is 'on the floor', which means in contact with a Tile or World bounds, or object that has set 'down' as blocked.
    */
    onFloor: function () {
        return this.blocked.down;
    },

    /**
    * Determins if this Body is 'on a wall', which means horizontally in contact with a Tile or World bounds, or other object but not the ground.
    *
    * @method Phaser.Physics.Arcade.Body#onWall
    * @return {boolean} True if this Body is 'on a wall', which means horizontally in contact with a Tile or World bounds, or other object but not the ground.
    */
    onWall: function () {
        return (!this.blocked.down && (this.blocked.left || this.blocked.right));
    },

    /**
    * Returns the delta x value. The amount the Body has moved horizontally in the current step.
    *
    * @method Phaser.Physics.Arcade.Body#deltaX
    * @return {number} The delta value. Positive if the motion was to the right, negative if to the left.
    */
    deltaX: function () {
        return this.x - this.preX;
    },

    /**
    * Returns the delta y value. The amount the Body has moved vertically in the current step.
    *
    * @method Phaser.Physics.Arcade.Body#deltaY
    * @return {number} The delta value. Positive if the motion was downwards, negative if upwards.
    */
    deltaY: function () {
        return this.y - this.preY;
    },

    /**
    * Returns the delta z value. The amount the Body has rotated in the current step.
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
* @property {number} x - The x coordinate of this Body.
*/
Object.defineProperty(Phaser.Physics.Arcade.Body.prototype, "x", {
    
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
* @property {number} y - The y coordinate of this Body.
*/
Object.defineProperty(Phaser.Physics.Arcade.Body.prototype, "y", {
    
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
