/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
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
    * @property {number} type - Internal Phaser Type value.
    * @protected
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
    * @property {Phaser.Point} minParticleSpeed - The minimum possible velocity of a particle.
    * @default
    */
    this.minParticleSpeed = new Phaser.Point(-100, -100);

    /**
    * @property {Phaser.Point} maxParticleSpeed - The maximum possible velocity of a particle.
    * @default
    */
    this.maxParticleSpeed = new Phaser.Point(100, 100);

    /**
    * @property {number} minParticleScale - The minimum possible scale of a particle.
    * @default
    */
    this.minParticleScale = 1;

    /**
    * @property {number} maxParticleScale - The maximum possible scale of a particle.
    * @default
    */
    this.maxParticleScale = 1;

    /**
    * @property {number} minRotation - The minimum possible angular velocity of a particle.
    * @default
    */
    this.minRotation = -360;

    /**
    * @property {number} maxRotation - The maximum possible angular velocity of a particle.
    * @default
    */
    this.maxRotation = 360;

    /**
    * @property {number} gravity - Sets the `body.gravity.y` of each particle sprite to this value on launch.
    * @default
    */
    this.gravity = 100;

    /**
    * @property {any} particleClass - For emitting your own particle class types. They must extend Phaser.Sprite.
    * @default
    */
    this.particleClass = Phaser.Sprite;

    /**
    * @property {Phaser.Point} particleDrag - The X and Y drag component of particles launched from the emitter.
    */
    this.particleDrag = new Phaser.Point();

    /**
    * @property {number} angularDrag - The angular drag component of particles launched from the emitter if they are rotating.
    * @default
    */
    this.angularDrag = 0;

    /**
    * @property {boolean} frequency - How often a particle is emitted in ms (if emitter is started with Explode === false).
    * @default
    */
    this.frequency = 100;

    /**
    * @property {number} lifespan - How long each particle lives once it is emitted in ms. Default is 2 seconds. Set lifespan to 'zero' for particles to live forever.
    * @default
    */
    this.lifespan = 2000;

    /**
    * @property {Phaser.Point} bounce - How much each particle should bounce on each axis.  1 = full bounce, 0 = no bounce.
    */
    this.bounce = new Phaser.Point();

    /**
    * @property {number} _quantity - Internal helper for deciding how many particles to launch.
    * @private
    */
    this._quantity = 0;

    /**
    * @property {number} _timer - Internal helper for deciding when to launch particles or kill them.
    * @private
    */
    this._timer = 0;

    /**
    * @property {number} _counter - Internal counter for figuring out how many particles to launch.
    * @private
    */
    this._counter = 0;

    /**
    * @property {boolean} _explode - Internal helper for the style of particle emission (all at once, or one at a time).
    * @private
    */
    this._explode = true;

    /**
    * @property {any} _frames - Internal helper for the particle frame.
    * @private
    */
    this._frames = null;

    /**
    * @property {boolean} on - Determines whether the emitter is currently emitting particles. It is totally safe to directly toggle this.
    * @default
    */
    this.on = false;

    /**
    * @property {boolean} exists - Determines whether the emitter is being updated by the core game loop.
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

};

/**
* This function generates a new array of particle sprites to attach to the emitter.
*
* @method Phaser.Particles.Arcade.Emitter#makeParticles
* @param {array|string} keys - A string or an array of strings that the particle sprites will use as their texture. If an array one is picked at random.
* @param {array|number} frames - A frame number, or array of frames that the sprite will use. If an array one is picked at random.
* @param {number} quantity - The number of particles to generate.
* @param {boolean} [collide=false] - Sets the checkCollision.none flag on the particle sprites body.
* @param {boolean} [collideWorldBounds=false] - A particle can be set to collide against the World bounds automatically and rebound back into the World if this is set to true. Otherwise it will leave the World.
* @return {Phaser.Particles.Arcade.Emitter} This Emitter instance.
*/
Phaser.Particles.Arcade.Emitter.prototype.makeParticles = function (keys, frames, quantity, collide, collideWorldBounds) {

    if (typeof frames === 'undefined') { frames = 0; }
    if (typeof quantity === 'undefined') { quantity = this.maxParticles; }
    if (typeof collide === 'undefined') { collide = false; }
    if (typeof collideWorldBounds === 'undefined') { collideWorldBounds = false; }

    var particle;
    var i = 0;
    var rndKey = keys;
    var rndFrame = frames;
    this._frames = frames;

    while (i < quantity)
    {
        if (typeof keys === 'object')
        {
            rndKey = this.game.rnd.pick(keys);
        }

        if (typeof frames === 'object')
        {
            rndFrame = this.game.rnd.pick(frames);
        }

        particle = new this.particleClass(this.game, 0, 0, rndKey, rndFrame);

        this.game.physics.arcade.enable(particle, false);

        if (collide)
        {
            particle.body.checkCollision.any = true;
            particle.body.checkCollision.none = false;
        }
        else
        {
            particle.body.checkCollision.none = true;
        }

        particle.body.collideWorldBounds = collideWorldBounds;

        particle.exists = false;
        particle.visible = false;

        //  Center the origin for rotation assistance
        particle.anchor.set(0.5);

        this.add(particle);

        i++;
    }

    return this;

};

/**
* Call this function to turn off all the particles and the emitter.
* @method Phaser.Particles.Arcade.Emitter#kill
*/
Phaser.Particles.Arcade.Emitter.prototype.kill = function () {

    this.on = false;
    this.alive = false;
    this.exists = false;

};

/**
* Handy for bringing game objects "back to life". Just sets alive and exists back to true.
* @method Phaser.Particles.Arcade.Emitter#revive
*/
Phaser.Particles.Arcade.Emitter.prototype.revive = function () {

    this.alive = true;
    this.exists = true;

};

/**
* Call this function to start emitting particles.
* @method Phaser.Particles.Arcade.Emitter#start
* @param {boolean} [explode=true] - Whether the particles should all burst out at once.
* @param {number} [lifespan=0] - How long each particle lives once emitted. 0 = forever.
* @param {number} [frequency=250] - Ignored if Explode is set to true. Frequency is how often to emit a particle in ms.
* @param {number} [quantity=0] - How many particles to launch. 0 = "all of the particles".
*/
Phaser.Particles.Arcade.Emitter.prototype.start = function (explode, lifespan, frequency, quantity) {

    if (typeof explode === 'undefined') { explode = true; }
    if (typeof lifespan === 'undefined') { lifespan = 0; }
    if (typeof frequency === 'undefined') { frequency = 250; }
    if (typeof quantity === 'undefined') { quantity = 0; }

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

};

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

    particle.angle = 0;
    particle.bringToTop();

    if (this.minParticleScale !== 1 || this.maxParticleScale !== 1)
    {
        particle.scale.set(this.game.rnd.realInRange(this.minParticleScale, this.maxParticleScale));
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

    if (this.minParticleSpeed.x !== this.maxParticleSpeed.x)
    {
        particle.body.velocity.x = this.game.rnd.integerInRange(this.minParticleSpeed.x, this.maxParticleSpeed.x);
    }
    else
    {
        particle.body.velocity.x = this.minParticleSpeed.x;
    }

    if (this.minParticleSpeed.y !== this.maxParticleSpeed.y)
    {
        particle.body.velocity.y = this.game.rnd.integerInRange(this.minParticleSpeed.y, this.maxParticleSpeed.y);
    }
    else
    {
        particle.body.velocity.y = this.minParticleSpeed.y;
    }

    if (this.minRotation !== this.maxRotation)
    {
        particle.body.angularVelocity = this.game.rnd.integerInRange(this.minRotation, this.maxRotation);
    }
    else if (this.minRotation !== 0)
    {
        particle.body.angularVelocity = this.minRotation;
    }

    if (typeof this._frames === 'object')
    {
        particle.frame = this.game.rnd.pick(this._frames);
    }
    else
    {
        particle.frame = this._frames;
    }

    particle.body.gravity.y = this.gravity;
    particle.body.drag.x = this.particleDrag.x;
    particle.body.drag.y = this.particleDrag.y;
    particle.body.angularDrag = this.angularDrag;

};

/**
* A more compact way of setting the width and height of the emitter.
* @method Phaser.Particles.Arcade.Emitter#setSize
* @param {number} width - The desired width of the emitter (particles are spawned randomly within these dimensions).
* @param {number} height - The desired height of the emitter.
*/
Phaser.Particles.Arcade.Emitter.prototype.setSize = function (width, height) {

    this.width = width;
    this.height = height;

};

/**
* A more compact way of setting the X velocity range of the emitter.
* @method Phaser.Particles.Arcade.Emitter#setXSpeed
* @param {number} [min=0] - The minimum value for this range.
* @param {number} [max=0] - The maximum value for this range.
*/
Phaser.Particles.Arcade.Emitter.prototype.setXSpeed = function (min, max) {

    min = min || 0;
    max = max || 0;

    this.minParticleSpeed.x = min;
    this.maxParticleSpeed.x = max;

};

/**
* A more compact way of setting the Y velocity range of the emitter.
* @method Phaser.Particles.Arcade.Emitter#setYSpeed
* @param {number} [min=0] - The minimum value for this range.
* @param {number} [max=0] - The maximum value for this range.
*/
Phaser.Particles.Arcade.Emitter.prototype.setYSpeed = function (min, max) {

    min = min || 0;
    max = max || 0;

    this.minParticleSpeed.y = min;
    this.maxParticleSpeed.y = max;

};

/**
* A more compact way of setting the angular velocity constraints of the emitter.
* @method Phaser.Particles.Arcade.Emitter#setRotation
* @param {number} [min=0] - The minimum value for this range.
* @param {number} [max=0] - The maximum value for this range.
*/
Phaser.Particles.Arcade.Emitter.prototype.setRotation = function (min, max) {

    min = min || 0;
    max = max || 0;

    this.minRotation = min;
    this.maxRotation = max;

};

/**
* Change the emitters center to match the center of any object with a `center` property, such as a Sprite.
* @method Phaser.Particles.Arcade.Emitter#at
* @param {object|Phaser.Sprite} object - The object that you wish to match the center with.
*/
Phaser.Particles.Arcade.Emitter.prototype.at = function (object) {

    if (object.center)
    {
        this.emitX = object.center.x;
        this.emitY = object.center.y;
    }

};

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
