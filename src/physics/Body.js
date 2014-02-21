/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Physics Body is typically linked to a single Sprite and defines properties that determine how the physics body is simulated.
* These properties affect how the body reacts to forces, what forces it generates on itself (to simulate friction), and how it reacts to collisions in the scene.
* In most cases, the properties are used to simulate physical effects. Each body also has its own property values that determine exactly how it reacts to forces and collisions in the scene.
* By default a single Rectangle shape is added to the Body that matches the dimensions of the parent Sprite. See addShape, removeShape, clearShapes to add extra shapes around the Body.
*
* @class Phaser.Physics.Body
* @classdesc Physics Body Constructor
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {Phaser.Sprite} [sprite] - The Sprite object this physics body belongs to.
* @param {number} [x=0] - The x coordinate of this Body.
* @param {number} [y=0] - The y coordinate of this Body.
* @param {number} [mass=1] - The default mass of this Body (0 = static).
*/
Phaser.Physics.Body = function (game, sprite, x, y, mass) {

    sprite = sprite || null;
    x = x || 0;
    y = y || 0;
    if (typeof mass === 'undefined') { mass = 1; }

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    /**
    * @property {Phaser.Sprite} sprite - Reference to the parent Sprite.
    */
    this.sprite = sprite;

    /**
    * @property {Phaser.Point} offset - The offset of the Physics Body from the Sprite x/y position.
    */
    this.offset = new Phaser.Point();

    /**
    * @property {p2.Body} data - The p2 Body data.
    * @protected
    */
    this.data = new p2.Body({ position:[this.px2pi(x), this.px2pi(y)], mass: mass });
    this.data.parent = this;

    /**
    * @property {Phaser.InversePointProxy} velocity - The velocity of the body. Set velocity.x to a negative value to move to the left, position to the right. velocity.y negative values move up, positive move down.
    */
    this.velocity = new Phaser.Physics.InversePointProxy(this.game, this.data.velocity);

    /**
    * @property {Phaser.InversePointProxy} force - The force applied to the body.
    */
    this.force = new Phaser.Physics.InversePointProxy(this.game, this.data.force);

    /**
    * @property {Phaser.Point} gravity - A locally applied gravity force to the Body. Applied directly before the world step. NOTE: Not currently implemented.
    */
    this.gravity = new Phaser.Point();

    /**
    * A Body can be set to collide against the World bounds automatically if this is set to true. Otherwise it will leave the World.
    * Note that this only applies if your World has bounds! The response to the collision should be managed via CollisionMaterials.
    * @property {boolean} collideWorldBounds - Should the Body collide with the World bounds?
    */
    this.collideWorldBounds = true;

    /**
    * @property {Phaser.Signal} onImpact - Dispatched when the shape/s of this Body impact with another. The event will be sent 2 parameters, this Body and the impact Body.
    */
    this.onImpact = new Phaser.Signal();

    /**
    * @property {array} collidesWith - Array of CollisionGroups that this Bodies shapes collide with.
    * @private
    */
    this.collidesWith = [];

    /**
    * @property {array} _bodyCallbacks - Array of Body callbacks.
    * @private
    */
    this._bodyCallbacks = [];

    /**
    * @property {array} _bodyCallbackContext - Array of Body callback contexts.
    * @private
    */
    this._bodyCallbackContext = [];

    /**
    * @property {array} _groupCallbacks - Array of Group callbacks.
    * @private
    */
    this._groupCallbacks = [];

    /**
    * @property {array} _bodyCallbackContext - Array of Grouo callback contexts.
    * @private
    */
    this._groupCallbackContext = [];

    //  Set-up the default shape
    if (sprite)
    {
        this.setRectangleFromSprite(sprite);

        this.game.physics.addBody(this);
    }

};

Phaser.Physics.Body.prototype = {

    /**
    * Sets a callback to be fired any time this Body impacts with the given Body. The impact test is performed against body.id values.
    * The callback will be sent 4 parameters: This body, the body that impacted, the Shape in this body and the shape in the impacting body.
    *
    * @method Phaser.Physics.Body#createBodyCallback
    * @param {Phaser.Physics.Body} body - The Body to send impact events for.
    * @param {function} callback - The callback to fire on impact. Set to null to clear a previously set callback.
    * @param {object} callbackContext - The context under which the callback will fire.
    */
    createBodyCallback: function (body, callback, callbackContext) {

        this._bodyCallbacks[body.data.id] = callback;
        this._bodyCallbackContext[body.data.id] = callbackContext;

    },

    /**
    * Sets a callback to be fired any time this Body impacts with the given Group. The impact test is performed against shape.collisionGroup values.
    * The callback will be sent 4 parameters: This body, the body that impacted, the Shape in this body and the shape in the impacting body.
    * This callback will only fire if this Body has been assigned a collision group.
    *
    * @method Phaser.Physics.Body#createGroupCallback
    * @param {Phaser.Physics.CollisionGroup} group - The Group to send impact events for.
    * @param {function} callback - The callback to fire on impact. Set to null to clear a previously set callback.
    * @param {object} callbackContext - The context under which the callback will fire.
    */
    createGroupCallback: function (group, callback, callbackContext) {

        this._groupCallbacks[group.mask] = callback;
        this._groupCallbackContext[group.mask] = callbackContext;

    },

    /**
    * Gets the collision bitmask from the groups this body collides with.
    *
    * @method Phaser.Physics.Body#getCollisionMask
    * @return {number} The bitmask.
    */
    getCollisionMask: function () {

        var mask = 0;

        if (this.collideWorldBounds)
        {
            mask = this.game.physics.boundsCollisionGroup.mask;
        }

        for (var i = 0; i < this.collidesWith.length; i++)
        {
            mask = mask | this.collidesWith[i].mask;
        }

        return mask;

    },

    /**
    * Sets the given CollisionGroup to be the collision group for all shapes in this Body, unless a shape is specified.
    * This also resets the collisionMask.
    *
    * @method Phaser.Physics.Body#setCollisionGroup
    * @param {Phaser.Physics.CollisionGroup|array} group - The Collision Group that this Bodies shapes will use.
    * @param {p2.Shape} [shape] - An optional Shape. If not provided the collision group will be added to all Shapes in this Body.
    */
    setCollisionGroup: function (group, shape) {

        var mask = this.getCollisionMask();

        if (typeof shape === 'undefined')
        {
            for (var i = this.data.shapes.length - 1; i >= 0; i--)
            {
                this.data.shapes[i].collisionGroup = group.mask;
                this.data.shapes[i].collisionMask = mask;
            }
        }
        else
        {
            shape.collisionGroup = group.mask;
            shapes.collisionMask = mask;
        }

    },

    /**
    * Clears the collision data from the shapes in this Body. Optionally clears Group and/or Mask.
    *
    * @method Phaser.Physics.Body#clearCollision
    * @param {boolean} [clearGroup=true] - Clear the collisionGroup value from the shape/s?
    * @param {boolean} [clearMask=true] - Clear the collisionMask value from the shape/s?
    * @param {p2.Shape} [shape] - An optional Shape. If not provided the collision data will be cleared from all Shapes in this Body.
    */
    clearCollision: function (clearGroup, clearMask, shape) {

        if (typeof shape === 'undefined')
        {
            for (var i = this.data.shapes.length - 1; i >= 0; i--)
            {
                if (clearGroup)
                {
                    this.data.shapes[i].collisionGroup = null;
                }

                if (clearMask)
                {
                    this.data.shapes[i].collisionMask = null;
                }
            }
        }
        else
        {
            if (clearGroup)
            {
                shapes.collisionGroup = null;
            }

            if (clearMask)
            {
                shapes.collisionMask = null;
            }
        }

        if (clearGroup)
        {
            this.collidesWith.length = 0;
        }

    },

    /**
    * Adds the given CollisionGroup, or array of CollisionGroups, to the list of groups that this body will collide with and updates the collision masks.
    *
    * @method Phaser.Physics.Body#collides
    * @param {Phaser.Physics.CollisionGroup|array} group - The Collision Group or Array of Collision Groups that this Bodies shapes will collide with.
    * @param {function} [callback] - Optional callback that will be triggered when this Body impacts with the given Group.
    * @param {object} [callbackContext] - The context under which the callback will be called.
    * @param {p2.Shape} [shape] - An optional Shape. If not provided the collision mask will be added to all Shapes in this Body.
    */
    collides: function (group, callback, callbackContext, shape) {

        if (Array.isArray(group))
        {
            for (var i = 0; i < group.length; i++)
            {
                if (this.collidesWith.indexOf(group[i]) === -1)
                {
                    this.collidesWith.push(group[i]);

                    if (callback)
                    {
                        this.createGroupCallback(group[i], callback, callbackContext);
                    }
                }
            }
        }
        else
        {
            if (this.collidesWith.indexOf(group) === -1)
            {
                this.collidesWith.push(group);

                if (callback)
                {
                    this.createGroupCallback(group, callback, callbackContext);
                }
            }
        }

        var mask = this.getCollisionMask();

        if (typeof shape === 'undefined')
        {
            for (var i = this.data.shapes.length - 1; i >= 0; i--)
            {
                this.data.shapes[i].collisionMask = mask;
            }
        }
        else
        {
            shape.collisionMask = mask;
        }

    },

    /**
    * Moves the shape offsets so their center of mass becomes the body center of mass.
    *
    * @method Phaser.Physics.Body#adjustCenterOfMass
    */
    adjustCenterOfMass: function () {

        this.data.adjustCenterOfMass();

    },

    /**
    * Apply damping, see http://code.google.com/p/bullet/issues/detail?id=74 for details.
    *
    * @method Phaser.Physics.Body#applyDamping
    * @param {number} dt - Current time step.
    */
    applyDamping: function (dt) {

        this.data.applyDamping(dt);

    },

    /**
    * Apply force to a world point. This could for example be a point on the RigidBody surface. Applying force this way will add to Body.force and Body.angularForce.
    *
    * @method Phaser.Physics.Body#applyForce
    * @param {number} force - The force to add.
    * @param {number} worldX - The world x point to apply the force on.
    * @param {number} worldY - The world y point to apply the force on.
    */
    applyForce: function (force, worldX, worldY) {

        this.data.applyForce(force, [this.px2p(worldX), this.px2p(worldY)]);

    },

    /**
    * Sets the force on the body to zero.
    *
    * @method Phaser.Physics.Body#setZeroForce
    */
    setZeroForce: function () {

        this.data.setZeroForce();

    },

    /**
    * If this Body is dynamic then this will zero its angular velocity.
    *
    * @method Phaser.Physics.Body#setZeroRotation
    */
    setZeroRotation: function () {

        this.data.angularVelocity = 0;

    },

    /**
    * If this Body is dynamic then this will zero its velocity on both axis.
    *
    * @method Phaser.Physics.Body#setZeroVelocity
    */
    setZeroVelocity: function () {

        this.data.velocity[0] = 0;
        this.data.velocity[1] = 0;

    },

    /**
    * Sets the Body damping and angularDamping to zero.
    *
    * @method Phaser.Physics.Body#setZeroDamping
    */
    setZeroDamping: function () {

        this.data.damping = 0;
        this.data.angularDamping = 0;

    },

    /**
    * Transform a world point to local body frame.
    *
    * @method Phaser.Physics.Body#toLocalFrame
    * @param {Float32Array|Array} out - The vector to store the result in.
    * @param {Float32Array|Array} worldPoint - The input world vector.
    */
    toLocalFrame: function (out, worldPoint) {

        return this.data.toLocalFrame(out, worldPoint);

    },

    /**
    * Transform a local point to world frame.
    *
    * @method Phaser.Physics.Body#toWorldFrame
    * @param {Array} out - The vector to store the result in.
    * @param {Array} localPoint - The input local vector.
    */
    toWorldFrame: function (out, localPoint) {

        return this.data.toWorldFrame(out, localPoint);

    },

    /**
    * This will rotate the Body by the given speed to the left (counter-clockwise).
    *
    * @method Phaser.Physics.Body#rotateLeft
    * @param {number} speed - The speed at which it should rotate.
    */
    rotateLeft: function (speed) {

        this.data.angularVelocity = this.px2p(-speed);

    },

    /**
    * This will rotate the Body by the given speed to the left (clockwise).
    *
    * @method Phaser.Physics.Body#rotateRight
    * @param {number} speed - The speed at which it should rotate.
    */
    rotateRight: function (speed) {

        this.data.angularVelocity = this.px2p(speed);

    },

    /**
    * Moves the Body forwards based on its current angle and the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveForward
    * @param {number} speed - The speed at which it should move forwards.
    */
    moveForward: function (speed) {

        var magnitude = this.px2pi(-speed);
        var angle = this.data.angle + Math.PI / 2;

        this.data.velocity[0] = magnitude * Math.cos(angle);
        this.data.velocity[1] = magnitude * Math.sin(angle);

    },

    /**
    * Moves the Body backwards based on its current angle and the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveBackward
    * @param {number} speed - The speed at which it should move backwards.
    */
    moveBackward: function (speed) {

        var magnitude = this.px2pi(-speed);
        var angle = this.data.angle + Math.PI / 2;

        this.data.velocity[0] = -(magnitude * Math.cos(angle));
        this.data.velocity[1] = -(magnitude * Math.sin(angle));

    },

    /**
    * Applies a force to the Body that causes it to 'thrust' forwards, based on its current angle and the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#thrust
    * @param {number} speed - The speed at which it should thrust.
    */
    thrust: function (speed) {

        var magnitude = this.px2pi(-speed);
        var angle = this.data.angle + Math.PI / 2;

        this.data.force[0] += magnitude * Math.cos(angle);
        this.data.force[1] += magnitude * Math.sin(angle);

    },

    /**
    * Applies a force to the Body that causes it to 'thrust' backwards (in reverse), based on its current angle and the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#rever
    * @param {number} speed - The speed at which it should reverse.
    */
    reverse: function (speed) {

        var magnitude = this.px2pi(-speed);
        var angle = this.data.angle + Math.PI / 2;

        this.data.force[0] -= magnitude * Math.cos(angle);
        this.data.force[1] -= magnitude * Math.sin(angle);

    },

    /**
    * If this Body is dynamic then this will move it to the left by setting its x velocity to the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveLeft
    * @param {number} speed - The speed at which it should move to the left, in pixels per second.
    */
    moveLeft: function (speed) {

        this.data.velocity[0] = this.px2pi(-speed);

    },

    /**
    * If this Body is dynamic then this will move it to the right by setting its x velocity to the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveRight
    * @param {number} speed - The speed at which it should move to the right, in pixels per second.
    */
    moveRight: function (speed) {

        this.data.velocity[0] = this.px2pi(speed);

    },

    /**
    * If this Body is dynamic then this will move it up by setting its y velocity to the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveUp
    * @param {number} speed - The speed at which it should move up, in pixels per second.
    */
    moveUp: function (speed) {

        this.data.velocity[1] = this.px2pi(-speed);

    },

    /**
    * If this Body is dynamic then this will move it down by setting its y velocity to the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveDown
    * @param {number} speed - The speed at which it should move down, in pixels per second.
    */
    moveDown: function (speed) {

        this.data.velocity[1] = this.px2pi(speed);

    },

    /**
    * Internal method. This is called directly before the sprites are sent to the renderer and after the update function has finished.
    *
    * @method Phaser.Physics.Body#preUpdate
    * @protected
    */
    preUpdate: function () {
    },

    /**
    * Internal method. This is called directly before the sprites are sent to the renderer and after the update function has finished.
    *
    * @method Phaser.Physics.Body#postUpdate
    * @protected
    */
    postUpdate: function () {

        this.sprite.x = this.p2pxi(this.data.position[0]);
        this.sprite.y = this.p2pxi(this.data.position[1]);

        if (!this.fixedRotation)
        {
            this.sprite.rotation = this.data.angle;
        }

    },

    /**
    * Resets the Body force, velocity (linear and angular) and rotation. Optionally resets damping and mass.
    *
    * @method Phaser.Physics.Body#reset
    * @param {number} x - The new x position of the Body.
    * @param {number} y - The new x position of the Body.
    * @param {boolean} [resetDamping=false] - Resets the linear and angular damping.
    * @param {boolean} [resetMass=false] - Sets the Body mass back to 1.
    */
    reset: function (x, y, resetDamping, resetMass) {

        if (typeof resetDamping === 'undefined') { resetDamping = false; }
        if (typeof resetMass === 'undefined') { resetMass = false; }

        this.setZeroForce();
        this.setZeroVelocity();
        this.setZeroRotation();

        if (resetDamping)
        {
            this.setZeroDamping();
        }

        if (resetMass)
        {
            this.mass = 1;
        }

        this.x = x;
        this.y = y;

    },

    /**
    * Adds this physics body to the world.
    *
    * @method Phaser.Physics.Body#addToWorld
    */
    addToWorld: function () {

        if (this.data.world !== this.game.physics.world)
        {
            this.game.physics.addBody(this);
        }

    },

    /**
    * Removes this physics body from the world.
    *
    * @method Phaser.Physics.Body#removeFromWorld
    */
    removeFromWorld: function () {

        if (this.data.world === this.game.physics.world)
        {
            this.game.physics.removeBody(this);
        }

    },

    /**
    * Destroys this Body and all references it holds to other objects.
    *
    * @method Phaser.Physics.Body#destroy
    */
    destroy: function () {

        this.removeFromWorld();

        this.clearShapes();

        this.sprite = null;

        /*
        this.collideCallback = null;
        this.collideCallbackContext = null;
        */

    },

    /**
    * Removes all Shapes from this Body.
    *
    * @method Phaser.Physics.Body#clearShapes
    */
    clearShapes: function () {

        for (var i = this.data.shapes.length - 1; i >= 0; i--)
        {
            var shape = this.data.shapes[i];
            this.data.removeShape(shape);
        }

    },

    /**
    * Add a shape to the body. You can pass a local transform when adding a shape, so that the shape gets an offset and an angle relative to the body center of mass.
    * Will automatically update the mass properties and bounding radius.
    *
    * @method Phaser.Physics.Body#addShape
    * @param {*} shape - The shape to add to the body.
    * @param {number} [offsetX=0] - Local horizontal offset of the shape relative to the body center of mass.
    * @param {number} [offsetY=0] - Local vertical offset of the shape relative to the body center of mass.
    * @param {number} [rotation=0] - Local rotation of the shape relative to the body center of mass, specified in radians.
    * @return {p2.Circle|p2.Rectangle|p2.Plane|p2.Line|p2.Particle} The shape that was added to the body.
    */
    addShape: function (shape, offsetX, offsetY, rotation) {

        if (typeof offsetX === 'undefined') { offsetX = 0; }
        if (typeof offsetY === 'undefined') { offsetY = 0; }
        if (typeof rotation === 'undefined') { rotation = 0; }

        this.data.addShape(shape, [this.px2pi(offsetX), this.px2pi(offsetY)], rotation);

        return shape;

    },

    /**
    * Adds a Circle shape to this Body. You can control the offset from the center of the body and the rotation.
    *
    * @method Phaser.Physics.Body#addCircle
    * @param {number} radius - The radius of this circle (in pixels)
    * @param {number} [offsetX=0] - Local horizontal offset of the shape relative to the body center of mass.
    * @param {number} [offsetY=0] - Local vertical offset of the shape relative to the body center of mass.
    * @param {number} [rotation=0] - Local rotation of the shape relative to the body center of mass, specified in radians.
    * @return {p2.Circle} The Circle shape that was added to the Body.
    */
    addCircle: function (radius, offsetX, offsetY, rotation) {

        var shape = new p2.Circle(this.px2p(radius));

        return this.addShape(shape, offsetX, offsetY, rotation);

    },

    /**
    * Adds a Rectangle shape to this Body. You can control the offset from the center of the body and the rotation.
    *
    * @method Phaser.Physics.Body#addRectangle
    * @param {number} width - The width of the rectangle in pixels.
    * @param {number} height - The height of the rectangle in pixels.
    * @param {number} [offsetX=0] - Local horizontal offset of the shape relative to the body center of mass.
    * @param {number} [offsetY=0] - Local vertical offset of the shape relative to the body center of mass.
    * @param {number} [rotation=0] - Local rotation of the shape relative to the body center of mass, specified in radians.
    * @return {p2.Rectangle} The Rectangle shape that was added to the Body.
    */
    addRectangle: function (width, height, offsetX, offsetY, rotation) {

        var shape = new p2.Rectangle(this.px2p(width), this.px2p(height));

        return this.addShape(shape, offsetX, offsetY, rotation);

    },

    /**
    * Adds a Plane shape to this Body. The plane is facing in the Y direction. You can control the offset from the center of the body and the rotation.
    *
    * @method Phaser.Physics.Body#addPlane
    * @param {number} [offsetX=0] - Local horizontal offset of the shape relative to the body center of mass.
    * @param {number} [offsetY=0] - Local vertical offset of the shape relative to the body center of mass.
    * @param {number} [rotation=0] - Local rotation of the shape relative to the body center of mass, specified in radians.
    * @return {p2.Plane} The Plane shape that was added to the Body.
    */
    addPlane: function (offsetX, offsetY, rotation) {

        var shape = new p2.Plane();

        return this.addShape(shape, offsetX, offsetY, rotation);

    },

    /**
    * Adds a Particle shape to this Body. You can control the offset from the center of the body and the rotation.
    *
    * @method Phaser.Physics.Body#addParticle
    * @param {number} [offsetX=0] - Local horizontal offset of the shape relative to the body center of mass.
    * @param {number} [offsetY=0] - Local vertical offset of the shape relative to the body center of mass.
    * @param {number} [rotation=0] - Local rotation of the shape relative to the body center of mass, specified in radians.
    * @return {p2.Particle} The Particle shape that was added to the Body.
    */
    addParticle: function (offsetX, offsetY, rotation) {

        var shape = new p2.Particle();

        return this.addShape(shape, offsetX, offsetY, rotation);

    },

    /**
    * Adds a Line shape to this Body.
    * The line shape is along the x direction, and stretches from [-length/2, 0] to [length/2,0].
    * You can control the offset from the center of the body and the rotation.
    *
    * @method Phaser.Physics.Body#addLine
    * @param {number} length - The length of this line (in pixels)
    * @param {number} [offsetX=0] - Local horizontal offset of the shape relative to the body center of mass.
    * @param {number} [offsetY=0] - Local vertical offset of the shape relative to the body center of mass.
    * @param {number} [rotation=0] - Local rotation of the shape relative to the body center of mass, specified in radians.
    * @return {p2.Line} The Line shape that was added to the Body.
    */
    addLine: function (length, offsetX, offsetY, rotation) {

        var shape = new p2.Line(this.px2p(length));

        return this.addShape(shape, offsetX, offsetY, rotation);

    },

    /**
    * Adds a Capsule shape to this Body.
    * You can control the offset from the center of the body and the rotation.
    *
    * @method Phaser.Physics.Body#addCapsule
    * @param {number} length - The distance between the end points in pixels.
    * @param {number} radius - Radius of the capsule in radians.
    * @param {number} [offsetX=0] - Local horizontal offset of the shape relative to the body center of mass.
    * @param {number} [offsetY=0] - Local vertical offset of the shape relative to the body center of mass.
    * @param {number} [rotation=0] - Local rotation of the shape relative to the body center of mass, specified in radians.
    * @return {p2.Capsule} The Capsule shape that was added to the Body.
    */
    addCapsule: function (length, radius, offsetX, offsetY, rotation) {

        var shape = new p2.Capsule(this.px2p(length), radius);

        return this.addShape(shape, offsetX, offsetY, rotation);

    },

    /**
    * Reads a polygon shape path, and assembles convex shapes from that and puts them at proper offset points. The shape must be simple and without holes.
    * This function expects the x.y values to be given in pixels. If you want to provide them at p2 world scales then call Body.data.fromPolygon directly.
    *
    * @method Phaser.Physics.Body#addPolygon
    * @param {object} options - An object containing the build options: 
    * @param {boolean} [options.optimalDecomp=false] - Set to true if you need optimal decomposition. Warning: very slow for polygons with more than 10 vertices.
    * @param {boolean} [options.skipSimpleCheck=false] - Set to true if you already know that the path is not intersecting itself.
    * @param {boolean|number} [options.removeCollinearPoints=false] - Set to a number (angle threshold value) to remove collinear points, or false to keep all points.
    * @param {(number[]|...number)} points - An array of 2d vectors that form the convex or concave polygon. 
    *                                       Either [[0,0], [0,1],...] or a flat array of numbers that will be interpreted as [x,y, x,y, ...], 
    *                                       or the arguments passed can be flat x,y values e.g. `setPolygon(options, x,y, x,y, x,y, ...)` where `x` and `y` are numbers.
    * @return {boolean} True on success, else false.
    */
    addPolygon: function (options, points) {

        options = options || {};

        points = Array.prototype.slice.call(arguments, 1);

        var path = [];

        //  Did they pass in a single array of points?
        if (points.length === 1 && Array.isArray(points[0]))
        {
            path = points[0].slice(0);
        }
        else if (Array.isArray(points[0]))
        {
            path = points[0].slice(0);
            // for (var i = 0, len = points[0].length; i < len; i += 2)
            // {
            //     path.push([points[0][i], points[0][i + 1]]);
            // }
        }
        else if (typeof points[0] === 'number')
        {
            // console.log('addPolygon --- We\'ve a list of numbers');
            //  We've a list of numbers
            for (var i = 0, len = points.length; i < len; i += 2)
            {
                path.push([points[i], points[i + 1]]);
            }
        }

        // console.log('addPolygon PATH pre');
        // console.log(path[1]);
        // console.table(path);

        //  top and tail
        var idx = path.length - 1;

        if ( path[idx][0] === path[0][0] && path[idx][1] === path[0][1] )
        {
            path.pop();
        }

        //  Now process them into p2 values
        for (var p = 0; p < path.length; p++)
        {
            path[p][0] = this.px2pi(path[p][0]);
            path[p][1] = this.px2pi(path[p][1]);
        }

        // console.log('addPolygon PATH POST');
        // console.log(path[1]);
        // console.table(path);

        return this.data.fromPolygon(path, options);

    },

    /**
    * Remove a shape from the body. Will automatically update the mass properties and bounding radius.
    *
    * @method Phaser.Physics.Body#removeShape
    * @param {p2.Circle|p2.Rectangle|p2.Plane|p2.Line|p2.Particle} shape - The shape to remove from the body.
    * @return {boolean} True if the shape was found and removed, else false.
    */
    removeShape: function (shape) {

        return this.data.removeShape(shape);

    },

    /**
    * Clears any previously set shapes. Then creates a new Circle shape and adds it to this Body.
    *
    * @method Phaser.Physics.Body#setCircle
    * @param {number} radius - The radius of this circle (in pixels)
    * @param {number} [offsetX=0] - Local horizontal offset of the shape relative to the body center of mass.
    * @param {number} [offsetY=0] - Local vertical offset of the shape relative to the body center of mass.
    * @param {number} [rotation=0] - Local rotation of the shape relative to the body center of mass, specified in radians.
    */
    setCircle: function (radius, offsetX, offsetY, rotation) {

        this.clearShapes();

        this.addCircle(radius, offsetX, offsetY, rotation);

    },

    /**
    * Clears any previously set shapes. The creates a new Rectangle shape at the given size and offset, and adds it to this Body.
    * If you wish to create a Rectangle to match the size of a Sprite or Image see Body.setRectangleFromSprite.
    *
    * @method Phaser.Physics.Body#setRectangle
    * @param {number} [width=16] - The width of the rectangle in pixels.
    * @param {number} [height=16] - The height of the rectangle in pixels.
    * @param {number} [offsetX=0] - Local horizontal offset of the shape relative to the body center of mass.
    * @param {number} [offsetY=0] - Local vertical offset of the shape relative to the body center of mass.
    * @param {number} [rotation=0] - Local rotation of the shape relative to the body center of mass, specified in radians.
    * @return {p2.Rectangle} The Rectangle shape that was added to the Body.
    */
    setRectangle: function (width, height, offsetX, offsetY, rotation) {

        if (typeof width === 'undefined') { width = 16; }
        if (typeof height === 'undefined') { height = 16; }

        this.clearShapes();

        return this.addRectangle(width, height, offsetX, offsetY, rotation);

    },

    /**
    * Clears any previously set shapes.
    * Then creates a Rectangle shape sized to match the dimensions and orientation of the Sprite given.
    * If no Sprite is given it defaults to using the parent of this Body.
    *
    * @method Phaser.Physics.Body#setRectangleFromSprite
    * @param {Phaser.Sprite|Phaser.Image} [sprite] - The Sprite on which the Rectangle will get its dimensions.
    * @return {p2.Rectangle} The Rectangle shape that was added to the Body.
    */
    setRectangleFromSprite: function (sprite) {

        if (typeof sprite === 'undefined') { sprite = this.sprite; }

        this.clearShapes();

        return this.addRectangle(sprite.width, sprite.height, 0, 0, sprite.rotation);

    },

    /**
    * Adds the given Material to all Shapes that belong to this Body.
    * If you only wish to apply it to a specific Shape in this Body then provide that as the 2nd parameter.
    *
    * @method Phaser.Physics.Body#setMaterial
    * @param {Phaser.Physics.Material} material - The Material that will be applied.
    * @param {p2.Shape} [shape] - An optional Shape. If not provided the Material will be added to all Shapes in this Body.
    */
    setMaterial: function (material, shape) {

        if (typeof shape === 'undefined')
        {
            for (var i = this.data.shapes.length - 1; i >= 0; i--)
            {
                this.data.shapes[i].material = material;
            }
        }
        else
        {
            shape.material = material;
        }

    },

    /**
    * Reads the shape data from a physics data file stored in the Game.Cache and adds it as a polygon to this Body.
    *
    * @method Phaser.Physics.Body#loadPolygon
    * @param {string} key - The key of the Physics Data file as stored in Game.Cache.
    * @param {string} object - The key of the object within the Physics data file that you wish to load the shape data from.
    * @param {object} options - An object containing the build options: 
    * @param {boolean} [options.optimalDecomp=false] - Set to true if you need optimal decomposition. Warning: very slow for polygons with more than 10 vertices.
    * @param {boolean} [options.skipSimpleCheck=false] - Set to true if you already know that the path is not intersecting itself.
    * @param {boolean|number} [options.removeCollinearPoints=false] - Set to a number (angle threshold value) to remove collinear points, or false to keep all points.
    * @return {boolean} True on success, else false.
    */
    loadPolygon: function (key, object, options) {

        var data = this.game.cache.getPhysicsData(key, object);

        if (data && data.shape)
        {
            var temp = [];

            //  We've a list of numbers
            for (var i = 0, len = data.shape.length; i < len; i += 2)
            {
                temp.push([data.shape[i], data.shape[i + 1]]);
            }

            return this.addPolygon(options, temp);
        }

        return false;

    },

    /**
    * Reads the physics data from a physics data file stored in the Game.Cache.
    * It will add the shape data to this Body, as well as set the density (mass), friction and bounce (restitution) values.
    *
    * @method Phaser.Physics.Body#loadPolygon
    * @param {string} key - The key of the Physics Data file as stored in Game.Cache.
    * @param {string} object - The key of the object within the Physics data file that you wish to load the shape data from.
    * @param {object} options - An object containing the build options: 
    * @param {boolean} [options.optimalDecomp=false] - Set to true if you need optimal decomposition. Warning: very slow for polygons with more than 10 vertices.
    * @param {boolean} [options.skipSimpleCheck=false] - Set to true if you already know that the path is not intersecting itself.
    * @param {boolean|number} [options.removeCollinearPoints=false] - Set to a number (angle threshold value) to remove collinear points, or false to keep all points.
    * @return {boolean} True on success, else false.
    */
    loadData: function (key, object, options) {

        var data = game.cache.getPhysicsData(key, object);

        if (data && data.shape)
        {
            this.mass = data.density;
            //  set friction + bounce here
            this.loadPolygon(key, object);
        }

    },

    /**
    * Convert p2 physics value (meters) to pixel scale.
    * 
    * @method Phaser.Physics.Body#p2px
    * @param {number} v - The value to convert.
    * @return {number} The scaled value.
    */
    p2px: function (v) {

        return v *= 20;

    },

    /**
    * Convert pixel value to p2 physics scale (meters).
    * 
    * @method Phaser.Physics.Body#px2p
    * @param {number} v - The value to convert.
    * @return {number} The scaled value.
    */
    px2p: function (v) {

        return v * 0.05;

    },

    /**
    * Convert p2 physics value (meters) to pixel scale and inverses it.
    * 
    * @method Phaser.Physics.Body#p2pxi
    * @param {number} v - The value to convert.
    * @return {number} The scaled value.
    */
    p2pxi: function (v) {

        return v *= -20;

    },

    /**
    * Convert pixel value to p2 physics scale (meters) and inverses it.
    * 
    * @method Phaser.Physics.Body#px2pi
    * @param {number} v - The value to convert.
    * @return {number} The scaled value.
    */
    px2pi: function (v) {

        return v * -0.05;

    }

};

Phaser.Physics.Body.prototype.constructor = Phaser.Physics.Body;

/**
* @name Phaser.Physics.Body#static
* @property {boolean} static - Returns true if the Body is static. Setting Body.static to 'false' will make it dynamic.
*/
Object.defineProperty(Phaser.Physics.Body.prototype, "static", {
    
    get: function () {

        return (this.data.motionState === Phaser.STATIC);

    },

    set: function (value) {

        if (value && this.data.motionState !== Phaser.STATIC)
        {
            this.data.motionState = Phaser.STATIC;
            this.mass = 0;
        }
        else if (!value && this.data.motionState === Phaser.STATIC)
        {
            this.data.motionState = Phaser.DYNAMIC;

            if (this.mass === 0)
            {
                this.mass = 1;
            }
        }

    }

});

/**
* @name Phaser.Physics.Body#dynamic
* @property {boolean} dynamic - Returns true if the Body is dynamic. Setting Body.dynamic to 'false' will make it static.
*/
Object.defineProperty(Phaser.Physics.Body.prototype, "dynamic", {
    
    get: function () {

        return (this.data.motionState === Phaser.DYNAMIC);

    },

    set: function (value) {

        if (value && this.data.motionState !== Phaser.DYNAMIC)
        {
            this.data.motionState = Phaser.DYNAMIC;

            if (this.mass === 0)
            {
                this.mass = 1;
            }
        }
        else if (!value && this.data.motionState === Phaser.DYNAMIC)
        {
            this.data.motionState = Phaser.STATIC;
            this.mass = 0;
        }

    }

});

/**
* @name Phaser.Physics.Body#kinematic
* @property {boolean} kinematic - Returns true if the Body is kinematic. Setting Body.kinematic to 'false' will make it static.
*/
Object.defineProperty(Phaser.Physics.Body.prototype, "kinematic", {
    
    get: function () {

        return (this.data.motionState === Phaser.KINEMATIC);

    },

    set: function (value) {

        if (value && this.data.motionState !== Phaser.KINEMATIC)
        {
            this.data.motionState = Phaser.KINEMATIC;
            this.mass = 4;
        }
        else if (!value && this.data.motionState === Phaser.KINEMATIC)
        {
            this.data.motionState = Phaser.STATIC;
            this.mass = 0;
        }

    }

});

/**
* @name Phaser.Physics.Body#allowSleep
* @property {boolean} allowSleep - 
*/
Object.defineProperty(Phaser.Physics.Body.prototype, "allowSleep", {
    
    get: function () {

        return this.data.allowSleep;

    },

    set: function (value) {

        if (value !== this.data.allowSleep)
        {
            this.data.allowSleep = value;
        }

    }

});

/**
* The angle of the Body in degrees from its original orientation. Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
* Values outside this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement Body.angle = 450 is the same as Body.angle = 90.
* If you wish to work in radians instead of degrees use the property Body.rotation instead. Working in radians is faster as it doesn't have to convert values.
* 
* @name Phaser.Physics.Body#angle
* @property {number} angle - The angle of this Body in degrees.
*/
Object.defineProperty(Phaser.Physics.Body.prototype, "angle", {

    get: function() {

        return Phaser.Math.wrapAngle(Phaser.Math.radToDeg(this.data.angle));

    },

    set: function(value) {

        this.data.angle = Phaser.Math.degToRad(Phaser.Math.wrapAngle(value));

    }

});

/**
* Damping is specified as a value between 0 and 1, which is the proportion of velocity lost per second.
* @name Phaser.Physics.Body#angularDamping
* @property {number} angularDamping - The angular damping acting acting on the body.
*/
Object.defineProperty(Phaser.Physics.Body.prototype, "angularDamping", {
    
    get: function () {

        return this.data.angularDamping;

    },

    set: function (value) {

        this.data.angularDamping = value;

    }

});

/**
* @name Phaser.Physics.Body#angularForce
* @property {number} angularForce - The angular force acting on the body.
*/
Object.defineProperty(Phaser.Physics.Body.prototype, "angularForce", {
    
    get: function () {

        return this.data.angularForce;

    },

    set: function (value) {

        this.data.angularForce = value;

    }

});

/**
* @name Phaser.Physics.Body#angularVelocity
* @property {number} angularVelocity - The angular velocity of the body.
*/
Object.defineProperty(Phaser.Physics.Body.prototype, "angularVelocity", {
    
    get: function () {

        return this.data.angularVelocity;

    },

    set: function (value) {

        this.data.angularVelocity = value;

    }

});

/**
* Damping is specified as a value between 0 and 1, which is the proportion of velocity lost per second.
* @name Phaser.Physics.Body#damping
* @property {number} damping - The linear damping acting on the body in the velocity direction.
*/
Object.defineProperty(Phaser.Physics.Body.prototype, "damping", {
    
    get: function () {

        return this.data.damping;

    },

    set: function (value) {

        this.data.damping = value;

    }

});

/**
* @name Phaser.Physics.Body#fixedRotation
* @property {boolean} fixedRotation - 
*/
Object.defineProperty(Phaser.Physics.Body.prototype, "fixedRotation", {
    
    get: function () {

        return this.data.fixedRotation;

    },

    set: function (value) {

        if (value !== this.data.fixedRotation)
        {
            this.data.fixedRotation = value;
            //  update anything?
        }

    }

});

/**
* @name Phaser.Physics.Body#inertia
* @property {number} inertia - The inertia of the body around the Z axis..
*/
Object.defineProperty(Phaser.Physics.Body.prototype, "inertia", {
    
    get: function () {

        return this.data.inertia;

    },

    set: function (value) {

        this.data.inertia = value;

    }

});

/**
* @name Phaser.Physics.Body#mass
* @property {number} mass - 
*/
Object.defineProperty(Phaser.Physics.Body.prototype, "mass", {
    
    get: function () {

        return this.data.mass;

    },

    set: function (value) {

        if (value !== this.data.mass)
        {
            this.data.mass = value;
            this.data.updateMassProperties();

            if (value === 0)
            {
                // this.static = true;
            }
        }

    }

});

/**
* @name Phaser.Physics.Body#motionState
* @property {number} motionState - The type of motion this body has. Should be one of: Body.STATIC (the body does not move), Body.DYNAMIC (body can move and respond to collisions) and Body.KINEMATIC (only moves according to its .velocity).
*/
Object.defineProperty(Phaser.Physics.Body.prototype, "motionState", {
    
    get: function () {

        return this.data.motionState;

    },

    set: function (value) {

        if (value !== this.data.motionState)
        {
            this.data.motionState = value;
            //  update?
        }

    }

});

/**
* The angle of the Body in radians.
* If you wish to work in degrees instead of radians use the Body.angle property instead. Working in radians is faster as it doesn't have to convert values.
* 
* @name Phaser.Physics.Body#rotation
* @property {number} rotation - The angle of this Body in radians.
*/
Object.defineProperty(Phaser.Physics.Body.prototype, "rotation", {

    get: function() {

        return this.data.angle;

    },

    set: function(value) {

        this.data.angle = value;

    }

});

/**
* @name Phaser.Physics.Body#sleepSpeedLimit
* @property {number} sleepSpeedLimit - .
*/
Object.defineProperty(Phaser.Physics.Body.prototype, "sleepSpeedLimit", {
    
    get: function () {

        return this.data.sleepSpeedLimit;

    },

    set: function (value) {

        this.data.sleepSpeedLimit = value;

    }

});

/**
* @name Phaser.Physics.Body#x
* @property {number} x - The x coordinate of this Body.
*/
Object.defineProperty(Phaser.Physics.Body.prototype, "x", {
    
    get: function () {

        return this.p2px(this.data.position[0]);

    },

    set: function (value) {

        this.data.position[0] = this.px2p(value);

    }

});

/**
* @name Phaser.Physics.Body#y
* @property {number} y - The y coordinate of this Body.
*/
Object.defineProperty(Phaser.Physics.Body.prototype, "y", {
    
    get: function () {

        return this.p2px(this.data.position[1]);

    },

    set: function (value) {

        this.data.position[1] = this.px2p(value);

    }

});
