/**
* Phaser - ArcadeEmitter
*
* Emitter is a lightweight particle emitter. It can be used for one-time explosions or for
* continuous effects like rain and fire. All it really does is launch Particle objects out
* at set intervals, and fixes their positions and velocities accorindgly.
*/

Phaser.Particles.Arcade.Emitter = function (game, x, y, maxParticles) {

	maxParticles = maxParticles || 50;

	Phaser.Group.call(this, game);

    /**
     * The X position of the top left corner of the emitter in world space.
     */
    this.x = x;

    /**
     * The Y position of the top left corner of emitter in world space.
     */
    this.y = y;

    /**
     * The width of the emitter.  Particles can be randomly generated from anywhere within this box.
     */
    this.width = 1;

    /**
     * The height of the emitter.  Particles can be randomly generated from anywhere within this box.
     */
    this.height = 1;

    /**
     * The minimum possible velocity of a particle.
     * The default value is (-100,-100).
     */
    this.minParticleSpeed = new Phaser.Point(-100, -100);

    /**
     * The maximum possible velocity of a particle.
     * The default value is (100,100).
     */
    this.maxParticleSpeed = new Phaser.Point(100, 100);

    /**
     * The minimum possible angular velocity of a particle.  The default value is -360.
     * NOTE: rotating particles are more expensive to draw than non-rotating ones!
     */
    this.minRotation = -360;

    /**
     * The maximum possible angular velocity of a particle.  The default value is 360.
     * NOTE: rotating particles are more expensive to draw than non-rotating ones!
     */
    this.maxRotation = 360;

    /**
     * Sets the <code>gravity.y</code> of each particle to this value on launch.
     */
    this.gravity = 2;

    /**
     * Set your own particle class type here.
     * Default is <code>Particle</code>.
     */
    this.particleClass = null;

    /**
     * The X and Y drag component of particles launched from the emitter.
     */
    this.particleDrag = new Phaser.Point();

    /**
     * How often a particle is emitted in ms (if emitter is started with Explode == false).
     */
    this.frequency = 100;

    /**
     * The total number of particles in this emitter.
     */
    this.maxParticles = maxParticles;

    /**
     * How long each particle lives once it is emitted in ms. Default is 2 seconds.
     * Set lifespan to 'zero' for particles to live forever.
     */
    this.lifespan = 2000;

    /**
     * How much each particle should bounce.  1 = full bounce, 0 = no bounce.
     */
    this.bounce = 0;

    /**
     * Internal helper for deciding how many particles to launch.
     */
    this._quantity = 0;

   /**
     * Internal helper for deciding when to launch particles or kill them.
     */
    this._timer = 0;

    /**
     * Internal counter for figuring out how many particles to launch.
     */
    this._counter = 0;

    /**
     * Internal helper for the style of particle emission (all at once, or one at a time).
     */
    this._explode = true;

    /**
     * Determines whether the emitter is currently emitting particles.
     * It is totally safe to directly toggle this.
     */
    this.on = false;

    this.exists = true;
    this.active = true;
    //	Needs to be a setter/getter and toggle the _container property
    this.visible = true;

    //	The point the particles are emitted from (Emitter.x/y control the container location, i.e. all particles, this controls position within it)
    this.emitX = 0;
    this.emitY = 0;
	
};

Phaser.Particles.Arcade.Emitter.prototype = Object.create(Phaser.Group.prototype);
Phaser.Particles.Arcade.Emitter.prototype.constructor = Phaser.Particles.Arcade.Emitter;

/**
 * Called automatically by the game loop, decides when to launch particles and when to "die".
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
 * @param graphics If you opted to not pre-configure an array of Sprite objects, you can simply pass in a particle image or sprite sheet.
 * @param quantity {number} The number of particles to generate when using the "create from image" option.
 * @param multiple {boolean} Whether the image in the Graphics param is a single particle or a bunch of particles (if it's a bunch, they need to be square!).
 * @param collide {number}  Whether the particles should be flagged as not 'dead' (non-colliding particles are higher performance).  0 means no collisions, 0-1 controls scale of particle's bounding box.
 *
 * @return  This Emitter instance (nice for chaining stuff together, if you're into that).
 */
Phaser.Particles.Arcade.Emitter.prototype.makeParticles = function (key, quantity, multiple, collide) {

	quantity = quantity || this.maxParticles;
	multiple = multiple || false;
	collide = collide || 0;

    var totalFrames = 1;
    var randomFrame;
    var particle;
    var i = 0;

    while (i < quantity)
    {
        if (this.particleClass == null)
        {
            particle = new Phaser.Sprite(this.game, 0, 0, key);
        }
        else
        {
            // particle = new this.particleClass(this.game);
        }

        if (multiple)
        {
            /*
            randomFrame = this.game.math.random()*totalFrames;
            */
        }
        else
        {
            // if (graphics)
            // {
                // particle.texture.loadImage(graphics);
            // }
        }

        if (collide > 0)
        {
            particle.body.allowCollision.any = true;
        }
        else
        {
            particle.body.allowCollision.none = true;
        }

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
 */
Phaser.Particles.Arcade.Emitter.prototype.kill = function () {

    this.on = false;
    this.alive = false;
    this.exists = false;

}

/**
 * Handy for bringing game objects "back to life". Just sets alive and exists back to true.
 * In practice, this is most often called by <code>Object.reset()</code>.
 */
Phaser.Particles.Arcade.Emitter.prototype.revive = function () {

    this.alive = true;
    this.exists = true;

}

/**
 * Call this function to start emitting particles.
 *
 * @param explode {boolean} Whether the particles should all burst out at once.
 * @param lifespan {number} How long each particle lives once emitted. 0 = forever.
 * @param frequency {number} Ignored if Explode is set to true. Frequency is how often to emit a particle in ms.
 * @param quantity {number} How many particles to launch. 0 = "all of the particles".
 */
Phaser.Particles.Arcade.Emitter.prototype.start = function (explode, lifespan, frequency, quantity) {

	if (typeof explode !== 'boolean')
	{
		explode = true;
	}

	lifespan = lifespan || 0;

	//	How many ms between emissions?
	frequency = frequency || 250;

	//	Total number of particles to emit
	quantity = quantity || 0;

    this.revive();

    this.visible = true;
    this.on = true;

    this._explode = explode;
    this.lifespan = lifespan;
    this.frequency = frequency;
	this._quantity += quantity;

    this._counter = 0;
    this._timer = this.game.time.now + frequency;

}

/**
 * This function can be used both internally and externally to emit the next particle.
 */
Phaser.Particles.Arcade.Emitter.prototype.emitParticle = function () {

    var particle = this.getFirstExists(false);

    if (particle == null)
    {
    	return;
    }

    if (this.width > 1 || this.height > 1)
    {
    	// particle.reset(this.x - this.game.rnd.integerInRange(this.left, this.right), this.y - this.game.rnd.integerInRange(this.top, this.bottom));
    	particle.reset(this.x - this.game.rnd.integerInRange(this.left, this.right), this.y - this.game.rnd.integerInRange(this.top, this.bottom));
    }
    else
    {
    	particle.reset(this.emitX, this.emitY);
    }

    particle.lifespan = this.lifespan;

    particle.body.bounce.setTo(this.bounce, this.bounce);

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

    particle.body.drag.x = this.particleDrag.x;
    particle.body.drag.y = this.particleDrag.y;

}

/**
 * A more compact way of setting the width and height of the emitter.
 *
 * @param width {number} The desired width of the emitter (particles are spawned randomly within these dimensions).
 * @param height {number} The desired height of the emitter.
 */
Phaser.Particles.Arcade.Emitter.prototype.setSize = function (width, height) {

    this.width = width;
    this.height = height;

}

/**
 * A more compact way of setting the X velocity range of the emitter.
 *
 * @param Min {number} The minimum value for this range.
 * @param Max {number} The maximum value for this range.
 */
Phaser.Particles.Arcade.Emitter.prototype.setXSpeed = function (min, max) {

	min = min || 0;
	max = max || 0;

    this.minParticleSpeed.x = min;
    this.maxParticleSpeed.x = max;

}

/**
 * A more compact way of setting the Y velocity range of the emitter.
 *
 * @param Min {number} The minimum value for this range.
 * @param Max {number} The maximum value for this range.
 */
Phaser.Particles.Arcade.Emitter.prototype.setYSpeed = function (min, max) {

	min = min || 0;
	max = max || 0;

    this.minParticleSpeed.y = min;
    this.maxParticleSpeed.y = max;

}

/**
 * A more compact way of setting the angular velocity constraints of the emitter.
 *
 * @param Min {number} The minimum value for this range.
 * @param Max {number} The maximum value for this range.
 */
Phaser.Particles.Arcade.Emitter.prototype.setRotation = function (min, max) {

	min = min || 0;
	max = max || 0;

    this.minRotation = min;
    this.maxRotation = max;

}

/**
 * Change the emitter's midpoint to match the midpoint of a <code>Object</code>.
 *
 * @param Object {object} The <code>Object</code> that you want to sync up with.
 */
Phaser.Particles.Arcade.Emitter.prototype.at = function (object) {

    //this.x = object.body.bounds.halfWidth - (this.width >> 1);
    //this.y = object.body.bounds.halfHeight - (this.height >> 1);

}

Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "left", {
    
    get: function () {
        return Math.floor(this.x - (this.width / 2));
    }

});

Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "right", {
    
    get: function () {
        return Math.floor(this.x + (this.width / 2));
    }

});

Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "top", {
    
    get: function () {
        return Math.floor(this.y - (this.height / 2));
    }

});

Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "bottom", {
    
    get: function () {
        return Math.floor(this.y + (this.height / 2));
    }

});
