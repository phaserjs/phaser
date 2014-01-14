/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser - ArcadeEmitter
*
* @class Phaser.Particles.Arcade.Emitter
* @classdesc Emitter is a lightweight particle emitter. It can be used for one-time explosions or for
* continuous effects like rain and fire. All it really does is launch Particle objects out
* at set intervals, and fixes their positions and velocities accorindgly.
* @constructor
* @extends Phaser.Group
* @param {Phaser.Game} game - Current game instance.
* @param {number} [x=0] - The x coordinate within the Emitter that the particles are emitted from.
* @param {number} [y=0] - The y coordinate within the Emitter that the particles are emitted from.
* @param {number} [maxParticles=50] - The total number of particles in this emitter..
*/

Phaser.Particles.Arcade.Emitter = function (game, x, y, maxParticles) {

    /**
    * The total number of particles in this emitter.
    * @property {number} maxParticles - The total number of particles in this emitter..
    * @default
    */
    this.maxParticles = maxParticles || 50;

    Phaser.Group.call(this, game);

    /**
    * @property {string} name - Description.
    */
    this.name = 'emitter' + this.game.particles.ID++;

    /**
    * @property {Description} type - Description.
    */
    this.type = Phaser.EMITTER;

    /**
    * @property {number} x - The X position of the top left corner of the emitter in world space.
    * @default
    */
    this.x = 0;

    /**
    * @property {number} y - The Y position of the top left corner of emitter in world space.
    * @default
    */
    this.y = 0;

    /**
    * @property {number} width - The width of the emitter.  Particles can be randomly generated from anywhere within this box.
    * @default
    */
    this.width = 1;

    /**
    * @property {number} height - The height of the emitter.  Particles can be randomly generated from anywhere within this box.
    * @default
    */
    this.height = 1;

    /**
    * The minimum possible velocity of a particle.
    * The default value is (-100,-100).
    * @property {Phaser.Point} minParticleSpeed
    */
    this.minParticleSpeed = new Phaser.Point(-100, -100);

    /**
    * The maximum possible velocity of a particle.
    * The default value is (100,100).
    * @property {Phaser.Point} maxParticleSpeed
    */
    this.maxParticleSpeed = new Phaser.Point(100, 100);

    /**
    * The minimum possible scale of a particle.
    * The default value is 1.
    * @property {number} minParticleScale
    * @default
    */
    this.minParticleScale = 1;

    /**
    * The maximum possible scale of a particle.
    * The default value is 1.
    * @property {number} maxParticleScale
    * @default
    */
    this.maxParticleScale = 1;

    /**
    * The minimum possible angular velocity of a particle.  The default value is -360.
    * @property {number} minRotation
    * @default
    */
    this.minRotation = -360;

    /**
    * The maximum possible angular velocity of a particle.  The default value is 360.
    * @property {number} maxRotation
    * @default
    */
    this.maxRotation = 360;

    /**
    * Sets the <code>gravity.y</code> of each particle to this value on launch.
    * @property {number} gravity
    * @default
    */
    this.gravity = 2;

    /**
    * Set your own particle class type here.
    * @property {Description} particleClass
    * @default
    */
    this.particleClass = null;

    /**
    * The friction component of particles launched from the emitter.
    * @property {number} particleFriction
    */
    this.particleFriction = 0;

    /**
    * The angular drag component of particles launched from the emitter if they are rotating.
    * @property {number} angularDrag
    * @default
    */
    this.angularDrag = 0;

    /**
    * How often a particle is emitted in ms (if emitter is started with Explode === false).
    * @property {boolean} frequency
    * @default
    */
    this.frequency = 100;

    /**
    * How long each particle lives once it is emitted in ms. Default is 2 seconds.
    * Set lifespan to 'zero' for particles to live forever.
    * @property {number} lifespan
    * @default
    */
    this.lifespan = 2000;

    /**
    * How much each particle should bounce on each axis.  1 = full bounce, 0 = no bounce.
    * @property {Phaser.Point} bounce
    */
    this.bounce = new Phaser.Point();

    /**
    * Internal helper for deciding how many particles to launch.
    * @property {number} _quantity
    * @private
    * @default
    */
    this._quantity = 0;

    /**
    * Internal helper for deciding when to launch particles or kill them.
    * @property {number} _timer
    * @private
    * @default
    */
    this._timer = 0;

    /**
    * Internal counter for figuring out how many particles to launch.
    * @property {number} _counter
    * @private
    * @default
    */
    this._counter = 0;

    /**
    * Internal helper for the style of particle emission (all at once, or one at a time).
    * @property {boolean} _explode
    * @private
    * @default
    */
    this._explode = true;

    /**
    * Determines whether the emitter is currently emitting particles.
    * It is totally safe to directly toggle this.
    * @property {boolean} on
    * @default
    */
    this.on = false;

    /**
    * Determines whether the emitter is being updated by the core game loop.
    * @property {boolean} exists
    * @default
    */
    this.exists = true;

    /**
    * The point the particles are emitted from.
    * Emitter.x and Emitter.y control the containers location, which updates all current particles
    * Emitter.emitX and Emitter.emitY control the emission location relative to the x/y position.
    * @property {boolean} emitX
    */
    this.emitX = x;
    
    /**
    * The point the particles are emitted from.
    * Emitter.x and Emitter.y control the containers location, which updates all current particles
    * Emitter.emitX and Emitter.emitY control the emission location relative to the x/y position.
    * @property {boolean} emitY
    */
    this.emitY = y;
    
};

Phaser.Particles.Arcade.Emitter.prototype = Object.create(Phaser.Group.prototype);
Phaser.Particles.Arcade.Emitter.prototype.constructor = Phaser.Particles.Arcade.Emitter;

/**
* Called automatically by the game loop, decides when to launch particles and when to "die".
* @method Phaser.Particles.Arcade.Emitter#update
*/
Phaser.Particles.Arcade.Emitter.prototype.update = function () {

    if (this.on)
    {
        if (this._explode)
        {
            this._counter = 0;

            do
            {
                this.emitParticle();
                this._counter++;
            }
            while (this._counter < this._quantity);

            this.on = false;
        }
        else
        {
            if (this.game.time.now >= this._timer)
            {
                this.emitParticle();
                
                this._counter++;

                if (this._quantity > 0)
                {
                    if (this._counter >= this._quantity)
                    {
                        this.on = false;
                    }
                }

                this._timer = this.game.time.now + this.frequency;
            }
        }
    }

}

/**
* This function generates a new array of particle sprites to attach to the emitter.
*
* @method Phaser.Particles.Arcade.Emitter#makeParticles
* @param {Description} keys - Description.
* @param {number} frames - Description.
* @param {number} quantity - The number of particles to generate when using the "create from image" option.
* @param {number} collide - Description.
* @param {boolean} collideWorldBounds - Description.
* @return This Emitter instance (nice for chaining stuff together, if you're into that).
*/
Phaser.Particles.Arcade.Emitter.prototype.makeParticles = function (keys, frames, quantity, collide, collideWorldBounds) {

    if (typeof frames == 'undefined')
    {
        frames = 0;
    }

    quantity = quantity || this.maxParticles;
    collide = collide || 0;

    if (typeof collideWorldBounds == 'undefined')
    {
        collideWorldBounds = false;
    }

    var particle;
    var i = 0;
    var rndKey = keys;
    var rndFrame = 0;

    while (i < quantity)
    {
        if (this.particleClass == null)
        {
            if (typeof keys == 'object')
            {
                rndKey = this.game.rnd.pick(keys);
            }

            if (typeof frames == 'object')
            {
                rndFrame = this.game.rnd.pick(frames);
            }

            particle = new Phaser.Sprite(this.game, 0, 0, rndKey, rndFrame);
        }
        // else
        // {
            // particle = new this.particleClass(this.game);
        // }

        if (collide > 0)
        {
            particle.body.allowCollision.any = true;
            particle.body.allowCollision.none = false;
        }
        else
        {
            particle.body.allowCollision.none = true;
        }

        particle.body.collideWorldBounds = collideWorldBounds;

        particle.exists = false;
        particle.visible = false;

        //  Center the origin for rotation assistance
        particle.anchor.setTo(0.5, 0.5);

        this.add(particle);

        i++;
    }

    return this;
}

/**
 * Call this function to turn off all the particles and the emitter.
 * @method Phaser.Particles.Arcade.Emitter#kill
 */
Phaser.Particles.Arcade.Emitter.prototype.kill = function () {

    this.on = false;
    this.alive = false;
    this.exists = false;

}

/**
 * Handy for bringing game objects "back to life". Just sets alive and exists back to true.
 * In practice, this is most often called by <code>Object.reset()</code>.
 * @method Phaser.Particles.Arcade.Emitter#revive
 */
Phaser.Particles.Arcade.Emitter.prototype.revive = function () {

    this.alive = true;
    this.exists = true;

}

/**
 * Call this function to start emitting particles.
 * @method Phaser.Particles.Arcade.Emitter#start
 * @param {boolean} explode - Whether the particles should all burst out at once.
 * @param {number} lifespan - How long each particle lives once emitted. 0 = forever.
 * @param {number} frequency - Ignored if Explode is set to true. Frequency is how often to emit a particle in ms.
 * @param {number} quantity - How many particles to launch. 0 = "all of the particles".
 */
Phaser.Particles.Arcade.Emitter.prototype.start = function (explode, lifespan, frequency, quantity) {

    if (typeof explode !== 'boolean')
    {
        explode = true;
    }

    lifespan = lifespan || 0;

    //  How many ms between emissions?
    frequency = frequency || 250;

    //  Total number of particles to emit
    quantity = quantity || 0;

    this.revive();

    this.visible = true;
    this.on = true;

    this._explode = explode;
    this.lifespan = lifespan;
    this.frequency = frequency;

    if (explode)
    {
        this._quantity = quantity;
    }
    else
    {
        this._quantity += quantity;
    }

    this._counter = 0;
    this._timer = this.game.time.now + frequency;

}

/**
 * This function can be used both internally and externally to emit the next particle.
 * @method Phaser.Particles.Arcade.Emitter#emitParticle
 */
Phaser.Particles.Arcade.Emitter.prototype.emitParticle = function () {

    var particle = this.getFirstExists(false);

    if (particle == null)
    {
        return;
    }

    if (this.width > 1 || this.height > 1)
    {
        particle.reset(this.game.rnd.integerInRange(this.left, this.right), this.game.rnd.integerInRange(this.top, this.bottom));
    }
    else
    {
        particle.reset(this.emitX, this.emitY);
    }

    particle.lifespan = this.lifespan;

    particle.body.bounce.setTo(this.bounce.x, this.bounce.y);

    if (this.minParticleSpeed.x != this.maxParticleSpeed.x)
    {
        particle.body.velocity.x = this.game.rnd.integerInRange(this.minParticleSpeed.x, this.maxParticleSpeed.x);
    }
    else
    {
        particle.body.velocity.x = this.minParticleSpeed.x;
    }

    if (this.minParticleSpeed.y != this.maxParticleSpeed.y)
    {
        particle.body.velocity.y = this.game.rnd.integerInRange(this.minParticleSpeed.y, this.maxParticleSpeed.y);
    }
    else
    {
        particle.body.velocity.y = this.minParticleSpeed.y;
    }

    particle.body.gravity.y = this.gravity;

    if (this.minRotation != this.maxRotation)
    {
        particle.body.angularVelocity = this.game.rnd.integerInRange(this.minRotation, this.maxRotation);
    }
    else
    {
        particle.body.angularVelocity = this.minRotation;
    }

    if (this.minParticleScale !== 1 || this.maxParticleScale !== 1)
    {
        var scale = this.game.rnd.realInRange(this.minParticleScale, this.maxParticleScale);
        particle.scale.setTo(scale, scale);
    }

    particle.body.friction = this.particleFriction;
    particle.body.angularDrag = this.angularDrag;

}

/**
* A more compact way of setting the width and height of the emitter.
* @method Phaser.Particles.Arcade.Emitter#setSize
* @param  {number} width - The desired width of the emitter (particles are spawned randomly within these dimensions).
* @param  {number} height - The desired height of the emitter.
*/
Phaser.Particles.Arcade.Emitter.prototype.setSize = function (width, height) {

    this.width = width;
    this.height = height;

}

/**
* A more compact way of setting the X velocity range of the emitter.
* @method Phaser.Particles.Arcade.Emitter#setXSpeed
* @param  {number} min - The minimum value for this range.
* @param  {number} max - The maximum value for this range.
*/
Phaser.Particles.Arcade.Emitter.prototype.setXSpeed = function (min, max) {

    min = min || 0;
    max = max || 0;

    this.minParticleSpeed.x = min;
    this.maxParticleSpeed.x = max;

}

/**
* A more compact way of setting the Y velocity range of the emitter.
* @method Phaser.Particles.Arcade.Emitter#setYSpeed
* @param  {number} min - The minimum value for this range.
* @param  {number} max - The maximum value for this range.
*/
Phaser.Particles.Arcade.Emitter.prototype.setYSpeed = function (min, max) {

    min = min || 0;
    max = max || 0;

    this.minParticleSpeed.y = min;
    this.maxParticleSpeed.y = max;

}

/**
* A more compact way of setting the angular velocity constraints of the emitter.
* @method Phaser.Particles.Arcade.Emitter#setRotation
* @param {number} min -  The minimum value for this range.
* @param {number} max -  The maximum value for this range.
*/
Phaser.Particles.Arcade.Emitter.prototype.setRotation = function (min, max) {

    min = min || 0;
    max = max || 0;

    this.minRotation = min;
    this.maxRotation = max;

}

/**
* Change the emitter's midpoint to match the midpoint of a <code>Object</code>.
* @method Phaser.Particles.Arcade.Emitter#at
* @param  {object} object - The <code>Object</code> that you want to sync up with.
*/
Phaser.Particles.Arcade.Emitter.prototype.at = function (object) {

    this.emitX = object.center.x;
    this.emitY = object.center.y;

}

/**
* The emitters alpha value.
* @name Phaser.Particles.Arcade.Emitter#alpha
* @property {number} alpha - Gets or sets the alpha value of the Emitter.
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "alpha", {
    
    get: function () {
        return this._container.alpha;
    },

    set: function (value) {
        this._container.alpha = value;
    }

});

/**
* The emitter visible state.
* @name Phaser.Particles.Arcade.Emitter#visible
* @property {boolean} visible - Gets or sets the Emitter visible state.
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "visible", {
    
    get: function () {
        return this._container.visible;
    },

    set: function (value) {
        this._container.visible = value;
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#x
* @property {number} x - Gets or sets the x position of the Emitter.
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "x", {

    get: function () {
        return this.emitX;
    },

    set: function (value) {
        this.emitX = value;
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#y
* @property {number} y - Gets or sets the y position of the Emitter.
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "y", {

    get: function () {
        return this.emitY;
    },

    set: function (value) {
        this.emitY = value;
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#left
* @property {number} left - Gets the left position of the Emitter.
* @readonly
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "left", {
    
    get: function () {
        return Math.floor(this.x - (this.width / 2));
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#right
* @property {number} right - Gets the right position of the Emitter.
* @readonly
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "right", {
    
    get: function () {
        return Math.floor(this.x + (this.width / 2));
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#top
* @property {number} top - Gets the top position of the Emitter.
* @readonly
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "top", {
    
    get: function () {
        return Math.floor(this.y - (this.height / 2));
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#bottom
* @property {number} bottom - Gets the bottom position of the Emitter.
* @readonly
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "bottom", {
    
    get: function () {
        return Math.floor(this.y + (this.height / 2));
    }

});
