/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Physics Body is linked to a single Sprite and defines properties that determine how the physics body is simulated.
* These properties affect how the body reacts to forces, what forces it generates on itself (to simulate friction), and how it reacts to collisions in the scene.
* In most cases, the properties are used to simulate physical effects. Each body also has its own property values that determine exactly how it reacts to forces and collisions in the scene.
* By default a single Rectangle shape is added to the Body that matches the dimensions of the parent Sprite. See addShape, removeShape, clearShapes to add extra shapes around the Body.
*
* @class Phaser.Physics.Body
* @classdesc Physics Body Constructor
* @constructor
* @param {Phaser.Sprite} sprite - The Sprite object this physics body belongs to.
*/
Phaser.Physics.Body = function (sprite) {

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
    * @property {p2.Body} data - The p2 Body data.
    * @protected
    */
    this.data = new p2.Body({ position:[this.px2p(sprite.position.x), this.px2p(sprite.position.y)], mass: 1 });

    /**
    * @property {Phaser.PointProxy} velocity - The velocity of the body. Set velocity.x to a negative value to move to the left, position to the right. velocity.y negative values move up, positive move down.
    */
    this.velocity = new Phaser.Physics.PointProxy(this.data.velocity);

    /**
    * @property {Phaser.PointProxy} force - The force applied to the body.
    */
    this.force = new Phaser.Physics.PointProxy(this.data.force);

    //  Set-up the default shape
    this.setRectangle(sprite.width, sprite.height, 0, 0);

    this.game.physics.addBody(this.data);

    //  Set-up contact events
    // this.sprite.events.onBeginContact = new Phaser.Signal();
    // this.sprite.events.onEndContact = new Phaser.Signal();

};

Phaser.Physics.Body.prototype = {

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

    //  toLocalFrame
    //  toWorldFrame

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

        this.data.angularVelocity = this.px2p(speed);

    },

    /**
    * This will rotate the Body by the given speed to the left (clockwise).
    *
    * @method Phaser.Physics.Body#rotateRight
    * @param {number} speed - The speed at which it should rotate.
    */
    rotateRight: function (speed) {

        this.data.angularVelocity = this.px2p(-speed);

    },

    /**
    * Applies a force to the Body that causes it to 'thrust' forwards, based on its current angle and the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#thrust
    * @param {number} speed - The speed at which it should thrust.
    */
    thrust: function (speed) {

        var magnitude = this.px2p(-speed);
        var angle = this.data.angle + Math.PI / 2;

        this.data.force[0] += magnitude * Math.cos(angle);
        this.data.force[1] += magnitude * Math.sin(angle);

    },

    /**
    * If this Body is dynamic then this will move it to the left by setting its x velocity to the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveLeft
    * @param {number} speed - The speed at which it should move to the left, in pixels per second.
    */
    moveLeft: function (speed) {

        this.data.velocity[0] = this.px2p(-speed);

    },

    /**
    * If this Body is dynamic then this will move it to the right by setting its x velocity to the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveRight
    * @param {number} speed - The speed at which it should move to the right, in pixels per second.
    */
    moveRight: function (speed) {

        this.data.velocity[0] = this.px2p(speed);

    },

    /**
    * If this Body is dynamic then this will move it up by setting its y velocity to the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveUp
    * @param {number} speed - The speed at which it should move up, in pixels per second.
    */
    moveUp: function (speed) {

        this.data.velocity[1] = this.px2p(-speed);

    },

    /**
    * If this Body is dynamic then this will move it down by setting its y velocity to the given speed.
    * The speed is represented in pixels per second. So a value of 100 would move 100 pixels in 1 second (1000ms).
    *
    * @method Phaser.Physics.Body#moveDown
    * @param {number} speed - The speed at which it should move down, in pixels per second.
    */
    moveDown: function (speed) {

        this.data.velocity[1] = this.px2p(speed);

    },

    /**
    * Internal method. This is called directly before the sprites are sent to the renderer and after the update function has finished.
    *
    * @method Phaser.Physics.Body#postUpdate
    * @protected
    */
    postUpdate: function () {

        this.sprite.x = this.p2px(this.data.position[0]);
        this.sprite.y = this.p2px(this.data.position[1]);

        if (!this.fixedRotation)
        {
            this.sprite.rotation = this.data.angle;
        }

    },

    /**
    * Resets the Body force, velocity (linear and angular) and rotation. Optionally resets damping and mass.
    *
    * @method Phaser.Physics.Body#reset
    * @param {boolean} [resetDamping=false] - Resets the linear and angular damping.
    * @param {boolean} [resetMass=false] - Sets the Body mass back to 1.
    */
    reset: function (resetDamping, resetMass) {

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

    },

    /**
    * Destroys this Body and all references it holds to other objects.
    *
    * @method Phaser.Physics.Body#destroy
    */
    destroy: function () {

        this.sprite = null;

        if (this.data.world === this.game.physics)
        {
            this.game.physics.removeBody(this.data);
        }

        this.clearShapes();

        /*
        this.collideCallback = null;
        this.collideCallbackContext = null;

        this.customSeparateCallback = null;
        this.customSeparateContext = null;
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
    * Add a shape to the body. You can pass a local transform when adding a shape, so that the shape gets an offset and angle relative to the body center of mass.
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

        this.data.addShape(shape, [this.px2p(offsetX), this.px2p(offsetY)], rotation);

        return shape;

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
    * Clears any previously set shapes and sets this Body to use a Circle for all collision.
    *
    * @method Phaser.Physics.Body#setCircle
    * @param {number} radius - The radius of this circle (in pixels)
    * @param {number} [offsetX=0] - Local horizontal offset of the shape relative to the body center of mass.
    * @param {number} [offsetY=0] - Local vertical offset of the shape relative to the body center of mass.
    * @param {number} [rotation=0] - Local rotation of the shape relative to the body center of mass, specified in radians.
    */
    setCircle: function (radius, offsetX, offsetY, rotation) {

        if (typeof offsetX === 'undefined') { offsetX = 0; }
        if (typeof offsetY === 'undefined') { offsetY = 0; }
        if (typeof rotation === 'undefined') { rotation = 0; }

        this.clearShapes();

        this.data.addShape(new p2.Circle(this.px2p(radius)), [offsetX, offsetY], rotation);

    },

    /**
    * Clears any previously set shapes and sets this Body to use a Rectangle for all collision.
    * If you don't specify any parameters it will be sized to match the parent Sprites current width and height (including scale factor).
    *
    * @method Phaser.Physics.Body#setRectangle
    * @param {number} [width] - The width of the rectangle. If not specified it will default to the width of the parent Sprite.
    * @param {number} [height] - The height of the rectangle. If not specified it will default to the height of the parent Sprite.
    * @param {number} [offsetX=0] - Local horizontal offset of the shape relative to the body center of mass.
    * @param {number} [offsetY=0] - Local vertical offset of the shape relative to the body center of mass.
    * @param {number} [rotation=0] - Local rotation of the shape relative to the body center of mass, specified in radians.
    */
    setRectangle: function (width, height, offsetX, offsetY, rotation) {

        if (typeof width === 'undefined') { width = this.sprite.width; }
        if (typeof height === 'undefined') { height = this.sprite.height; }
        if (typeof offsetX === 'undefined') { offsetX = 0; }
        if (typeof offsetY === 'undefined') { offsetY = 0; }
        if (typeof rotation === 'undefined') { rotation = 0; }

        // var px = 0;
        // var py = 0;

        // if (sprite.anchor.x !== 0)
        // {
        //     px = (sprite.width / 2) + (-sprite.width * sprite.anchor.x);
        // }
        // else
        // {
        //     px = sprite.width / 2;
        // }

        // if (sprite.anchor.y !== 0)
        // {
        //     py = (sprite.height / 2) + (-sprite.height * sprite.anchor.y);
        // }
        // else
        // {
        //     py = sprite.height / 2;
        // }
    
        this.clearShapes();

        this.data.addShape(new p2.Rectangle(this.px2p(width), this.px2p(height)), [this.px2p(offsetX), this.px2p(offsetY)], rotation);

    },

    /**
    * Reads a polygon shape path, and assembles convex shapes from that and puts them at proper offset points. The shape must be simple and without holes.
    * This function expects the x.y values to be given in pixels. If you want to provide them at p2 world scales then call Body.data.fromPolygon directly.
    *
    * @method Phaser.Physics.Body#setPolygon
    * @param {object} options - An object containing the build options: 
    * @param {boolean} [options.optimalDecomp=false] - Set to true if you need optimal decomposition. Warning: very slow for polygons with more than 10 vertices.
    * @param {boolean} [options.skipSimpleCheck=false] - Set to true if you already know that the path is not intersecting itself.
    * @param {boolean|number} [options.removeCollinearPoints=false] - Set to a number (angle threshold value) to remove collinear points, or false to keep all points.
    * @param {(number[]|...number)} points - An array of 2d vectors that form the convex or concave polygon. 
    *                                       Either [[0,0], [0,1],...] or a flat array of numbers that will be interpreted as [x,y, x,y, ...], 
    *                                       or the arguments passed can be flat x,y values e.g. `setPolygon(options, x,y, x,y, x,y, ...)` where `x` and `y` are numbers.
    * @return {boolean} True on success, else false.
    */
    setPolygon: function (options, points) {

        options = options || {};

        points = Array.prototype.slice.call(arguments, 1);

        var path;

        //  Did they pass in a single array of points?
        if (points.length === 1)
        {
            // console.log('part 1', points.length);
            path = points[0];
        }
        else if (Array.isArray(points[0]))
        {
            // console.log('part 2', points.length);
            path = points;
        }
        else if (typeof points[0] === 'number')
        {
            //  A list of numbers?
            // console.log('part 3');

            var temp = [];

            //  We've a list of numbers
            for (var i = 0, len = points.length; i < len; i += 2)
            {
                temp.push([points[i], points[i + 1]]);
            }

            path = temp;
        }

        //  Now process them into p2 values
        for (var p = 0; p < path.length; p++)
        {
            path[p][0] = this.px2p(path[p][0]);
            path[p][1] = this.px2p(path[p][1]);
        }

        // console.log('points');
        // console.table(points);
        // console.log('PATH');
        // console.log(path);

        return this.data.fromPolygon(path, options);

    },

    /**
    * Convert p2 physics value to pixel scale.
    * 
    * @method Phaser.Math#p2px
    * @param {number} v - The value to convert.
    * @return {number} The scaled value.
    */
    p2px: function (v) {

        return v *= -20;

    },

    /**
    * Convert pixel value to p2 physics scale.
    * 
    * @method Phaser.Math#px2p
    * @param {number} v - The value to convert.
    * @return {number} The scaled value.
    */
    px2p: function (v) {

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
        }
        else if (!value && this.data.motionState === Phaser.STATIC)
        {
            this.data.motionState = Phaser.DYNAMIC;
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
        }
        else if (!value && this.data.motionState === Phaser.DYNAMIC)
        {
            this.data.motionState = Phaser.STATIC;
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
        }
        else if (!value && this.data.motionState === Phaser.KINEMATIC)
        {
            this.data.motionState = Phaser.STATIC;
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
