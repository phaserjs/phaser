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

//  force

    this.shape = null;

    this.data = new p2.Body({ position:[this.px2p(sprite.x), this.px2p(sprite.y)], mass: 1 });

    /**
    * @property {Phaser.PointProxy} velocity - The velocity of the body. Set velocity.x to a negative value to move to the left, position to the right. velocity.y negative values move up, positive move down.
    */
    this.velocity = new Phaser.Physics.PointProxy(this.data.velocity);

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

    //  Set-up the default shape
    this.setRectangle(sprite.width, sprite.height, 0, 0);

    this.game.physics.addBody(this.data);

    //  Set-up contact events
    // this.sprite.events.onBeginContact = new Phaser.Signal();
    // this.sprite.events.onEndContact = new Phaser.Signal();

};

Phaser.Physics.Body.prototype = {

    /*
    * Add a shape to the body. You can pass a local transform when adding a shape, 
    * so that the shape gets an offset and angle relative to the body center of mass. 
    * Will automatically update the mass properties and bounding radius.
    *
    * @method Phaser.Physics.Body#addShape
    */
    addShape: function (shape, offsetX, offsetY, angle) {

        if (typeof offsetX === 'undefined') { offsetX = 0; }
        if (typeof offsetY === 'undefined') { offsetY = 0; }
        if (typeof angle === 'undefined') { angle = 0; }

        return this.data.addShape(shape, [ this.px2p(offsetX), this.px2p(offsetY) ], angle);

    },

    /**
    * Moves the shape offsets so their center of mass becomes the body center of mass.
    *
    * @method Phaser.Physics.Body#adjustCenterOfMass
    */
    adjustCenterOfMass: function () {

        this.data.adjustCenterOfMass();

    },

    //  applyDamping
    //  applyForce
    //  fromPolygon

    /**
    * Remove a shape from the Body.
    *
    * @method Phaser.Physics.Body#removeShape
    */
    removeShape: function (shape) {

        return this.data.removeShape(shape);

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
    * Internal method that updates the Body scale in relation to the parent Sprite.
    *
    * @method Phaser.Physics.Body#updateScale
    * @protected
    */
    updateScale: function () {

        // if (this.polygon)
        // {
        //     this.polygon.scale(this.sprite.scale.x / this._sx, this.sprite.scale.y / this._sy);
        // }
        // else
        // {
        //     this.shape.r *= Math.max(this.sprite.scale.x, this.sprite.scale.y);
        // }

        this._sx = this.sprite.scale.x;
        this._sy = this.sprite.scale.y;

    },

    /**
    * Internal method that updates the Body position in relation to the parent Sprite.
    *
    * @method Phaser.Physics.Body#preUpdate
    * @protected
    */
    preUpdate: function () {

        // this.x = (this.sprite.world.x - (this.sprite.anchor.x * this.sprite.width)) + this.offset.x;
        // this.y = (this.sprite.world.y - (this.sprite.anchor.y * this.sprite.height)) + this.offset.y;

        //  This covers any motion that happens during this frame, not since the last frame
        // this.preX = this.x;
        // this.preY = this.y;
        // this.preRotation = this.sprite.angle;

        // this.rotation = this.preRotation;

        if (this.sprite.scale.x !== this._sx || this.sprite.scale.y !== this._sy)
        {
            this.updateScale();
        }

    },

    /**
    * Internal method. This is called directly before the sprites are sent to the renderer and after the update function has finished.
    *
    * @method Phaser.Physics.Body#postUpdate
    * @protected
    */
    postUpdate: function () {

        /*
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
        */

        this.sprite.x = this.p2px(this.data.position[0]);
        this.sprite.y = this.p2px(this.data.position[1]);
        this.sprite.rotation = this.data.angle;

    },

    /**
    * Resets the Body motion values: velocity, acceleration, angularVelocity and angularAcceleration.
    * Also resets the forces to defaults: gravity, bounce, minVelocity,maxVelocity, angularDrag, maxAngular, mass, friction and checkCollision if 'full' specified.
    *
    * @method Phaser.Physics.Body#reset
    * @param {boolean} [full=false] - A full reset clears down settings you may have set, such as gravity, bounce and drag. A non-full reset just clears motion values.
    */
    reset: function (full) {

        /*
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
        */

    },

    /**
    * Destroys this Body and all references it holds to other objects.
    *
    * @method Phaser.Physics.Body#destroy
    */
    destroy: function () {

        this.sprite = null;

        /*
        this.collideCallback = null;
        this.collideCallbackContext = null;

        this.customSeparateCallback = null;
        this.customSeparateContext = null;

        this.contacts.length = 0;
        */

    },

    /**
    * Sets this Body to use a circle of the given radius for all collision.
    * The Circle will be centered on the center of the Sprite by default, but can be adjusted via the Body.offset property and the setCircle x/y parameters.
    *
    * @method Phaser.Physics.Body#setCircle
    * @param {number} radius - The radius of this circle (in pixels)
    * @param {number} [offsetX=0] - The x amount the circle will be offset from the Sprites center.
    * @param {number} [offsetY=0] - The y amount the circle will be offset from the Sprites center.
    */
    setCircle: function (radius, offsetX, offsetY) {

        // if (typeof offsetX === 'undefined') { offsetX = this.sprite._cache.halfWidth; }
        // if (typeof offsetY === 'undefined') { offsetY = this.sprite._cache.halfHeight; }

        // this.type = Phaser.Physics.Arcade.CIRCLE;
        // this.shape = new SAT.Circle(new SAT.Vector(this.sprite.x, this.sprite.y), radius);
        // this.polygon = null;

        // this.offset.setTo(offsetX, offsetY);

    },

    /**
    * Sets this Body to use a rectangle for all collision.
    * If you don't specify any parameters it will be sized to match the parent Sprites current width and height (including scale factor) and centered on the sprite.
    *
    * @method Phaser.Physics.Body#setRectangle
    * @param {number} [width] - The width of the rectangle. If not specified it will default to the width of the parent Sprite.
    * @param {number} [height] - The height of the rectangle. If not specified it will default to the height of the parent Sprite.
    * @param {number} [translateX] - The x amount the rectangle will be translated from the Sprites center.
    * @param {number} [translateY] - The y amount the rectangle will be translated from the Sprites center.
    */
    setRectangle: function (width, height, offsetX, offsetY) {

        if (typeof width === 'undefined') { width = this.sprite.width; }
        if (typeof height === 'undefined') { height = this.sprite.height; }
        // if (typeof translateX === 'undefined') { translateX = this.sprite.width / 2; }
        // if (typeof translateY === 'undefined') { translateY = this.sprite.height / 2; }

        //  This means 1 shape per body, need to move this to an array or similar
        this.shape = new p2.Rectangle(this.px2p(width), this.px2p(height));
        this.data.addShape(this.shape);

        this.offset.setTo(0, 0);

    },

    /**
    * Sets this Body to use a convex polygon for collision.
    * The points are specified in a counter-clockwise direction and must create a convex polygon.
    * Use Body.translate and/or Body.offset to re-position the polygon from the Sprite origin.
    *
    * @method Phaser.Physics.Body#setPolygon
    * @param {(SAT.Vector[]|number[]|...SAT.Vector|...number)} points - This can be an array of Vectors that form the polygon,
    *      a flat array of numbers that will be interpreted as [x,y, x,y, ...], or the arguments passed can be
    *      all the points of the polygon e.g. `setPolygon(new SAT.Vector(), new SAT.Vector(), ...)`, or the
    *      arguments passed can be flat x,y values e.g. `setPolygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers.
    */
    setPolygon: function (points) {

        /*
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
        */

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
