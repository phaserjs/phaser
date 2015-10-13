/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Emitter is a lightweight particle emitter that uses Arcade Physics.
* It can be used for one-time explosions or for continuous effects like rain and fire.
* All it really does is launch Particle objects out at set intervals, and fixes their positions and velocities accordingly.
* 
* @class Phaser.Particles.Arcade.Emitter
* @constructor
* @extends Phaser.Group
* @param {Phaser.Game} game - Current game instance.
* @param {number} [x=0] - The x coordinate within the Emitter that the particles are emitted from.
* @param {number} [y=0] - The y coordinate within the Emitter that the particles are emitted from.
* @param {number} [maxParticles=50] - The total number of particles in this emitter.
*/
Phaser.Particles.Arcade.Emitter = function (game, x, y, maxParticles) {

    /**
    * @property {number} maxParticles - The total number of particles in this emitter.
    * @default
    */
    this.maxParticles = maxParticles || 50;

    Phaser.Group.call(this, game);

    /**
    * @property {string} name - A handy string name for this emitter. Can be set to anything.
    */
    this.name = 'emitter' + this.game.particles.ID++;

    /**
    * @property {number} type - Internal Phaser Type value.
    * @protected
    */
    this.type = Phaser.EMITTER;

    /**
    * @property {number} physicsType - The const physics body type of this object.
    * @readonly
    */
    this.physicsType = Phaser.GROUP;

    /**
    * @property {Phaser.Rectangle} area - The area of the emitter. Particles can be randomly generated from anywhere within this rectangle.
    * @default
    */
    this.area = new Phaser.Rectangle(x, y, 1, 1);

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
    * @property {number} minParticleScale - The minimum possible scale of a particle. This is applied to the X and Y axis. If you need to control each axis see minParticleScaleX.
    * @default
    */
    this.minParticleScale = 1;

    /**
    * @property {number} maxParticleScale - The maximum possible scale of a particle. This is applied to the X and Y axis. If you need to control each axis see maxParticleScaleX.
    * @default
    */
    this.maxParticleScale = 1;

    /**
    * @property {array} scaleData - An array of the calculated scale easing data applied to particles with scaleRates > 0.
    */
    this.scaleData = null;

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
    * @property {number} minParticleAlpha - The minimum possible alpha value of a particle.
    * @default
    */
    this.minParticleAlpha = 1;

    /**
    * @property {number} maxParticleAlpha - The maximum possible alpha value of a particle.
    * @default
    */
    this.maxParticleAlpha = 1;

    /**
    * @property {array} alphaData - An array of the calculated alpha easing data applied to particles with alphaRates > 0.
    */
    this.alphaData = null;

    /**
    * @property {number} gravity - Sets the `body.gravity.y` of each particle sprite to this value on launch.
    * @default
    */
    this.gravity = 100;

    /**
    * @property {any} particleClass - For emitting your own particle class types. They must extend Phaser.Particle.
    * @default
    */
    this.particleClass = Phaser.Particle;

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
    * @property {number} frequency - How often a particle is emitted in ms (if emitter is started with Explode === false).
    * @default
    */
    this.frequency = 100;

    /**
    * @property {number} lifespan - How long each particle lives once it is emitted in ms. Default is 2 seconds. Set lifespan to 'zero' for particles to live forever.
    * @default
    */
    this.lifespan = 2000;

    /**
    * @property {Phaser.Point} bounce - How much each particle should bounce on each axis. 1 = full bounce, 0 = no bounce.
    */
    this.bounce = new Phaser.Point();

    /**
    * @property {boolean} on - Determines whether the emitter is currently emitting particles. It is totally safe to directly toggle this.
    * @default
    */
    this.on = false;

    /**
    * @property {Phaser.Point} particleAnchor - When a particle is created its anchor will be set to match this Point object (defaults to x/y: 0.5 to aid in rotation)
    * @default
    */
    this.particleAnchor = new Phaser.Point(0.5, 0.5);

    /**
    * @property {number} blendMode - The blendMode as set on the particle when emitted from the Emitter. Defaults to NORMAL. Needs browser capable of supporting canvas blend-modes (most not available in WebGL)
    * @default
    */
    this.blendMode = Phaser.blendModes.NORMAL;

    /**
    * The point the particles are emitted from.
    * Emitter.x and Emitter.y control the containers location, which updates all current particles
    * Emitter.emitX and Emitter.emitY control the emission location relative to the x/y position.
    * @property {number} emitX
    */
    this.emitX = x;

    /**
    * The point the particles are emitted from.
    * Emitter.x and Emitter.y control the containers location, which updates all current particles
    * Emitter.emitX and Emitter.emitY control the emission location relative to the x/y position.
    * @property {number} emitY
    */
    this.emitY = y;

    /**
    * @property {boolean} autoScale - When a new Particle is emitted this controls if it will automatically scale in size. Use Emitter.setScale to configure.
    */
    this.autoScale = false;

    /**
    * @property {boolean} autoAlpha - When a new Particle is emitted this controls if it will automatically change alpha. Use Emitter.setAlpha to configure.
    */
    this.autoAlpha = false;

    /**
    * @property {boolean} particleBringToTop - If this is `true` then when the Particle is emitted it will be bought to the top of the Emitters display list.
    * @default
    */
    this.particleBringToTop = false;

    /**
    * @property {boolean} particleSendToBack - If this is `true` then when the Particle is emitted it will be sent to the back of the Emitters display list.
    * @default
    */
    this.particleSendToBack = false;

    /**
    * @property {Phaser.Point} _minParticleScale - Internal particle scale var.
    * @private
    */
    this._minParticleScale = new Phaser.Point(1, 1);

    /**
    * @property {Phaser.Point} _maxParticleScale - Internal particle scale var.
    * @private
    */
    this._maxParticleScale = new Phaser.Point(1, 1);

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
    * @property {number} _flowQuantity - Internal counter for figuring out how many particles to launch per flow update.
    * @private
    */
    this._flowQuantity = 0;

    /**
    * @property {number} _flowTotal - Internal counter for figuring out how many particles to launch in total.
    * @private
    */
    this._flowTotal = 0;

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

};

Phaser.Particles.Arcade.Emitter.prototype = Object.create(Phaser.Group.prototype);
Phaser.Particles.Arcade.Emitter.prototype.constructor = Phaser.Particles.Arcade.Emitter;

/**
* Called automatically by the game loop, decides when to launch particles and when to "die".
* 
* @method Phaser.Particles.Arcade.Emitter#update
*/
Phaser.Particles.Arcade.Emitter.prototype.update = function () {

    if (this.on && this.game.time.time >= this._timer)
    {
        this._timer = this.game.time.time + this.frequency * this.game.time.slowMotion;

        if (this._flowTotal !== 0)
        {
            if (this._flowQuantity > 0)
            {
                for (var i = 0; i < this._flowQuantity; i++)
                {
                    if (this.emitParticle())
                    {
                        this._counter++;

                        if (this._flowTotal !== -1 && this._counter >= this._flowTotal)
                        {
                            this.on = false;
                            break;
                        }
                    }
                }
            }
            else
            {
                if (this.emitParticle())
                {
                    this._counter++;

                    if (this._flowTotal !== -1 && this._counter >= this._flowTotal)
                    {
                        this.on = false;
                    }
                }
            }
        }
        else
        {
            if (this.emitParticle())
            {
                this._counter++;

                if (this._quantity > 0 && this._counter >= this._quantity)
                {
                    this.on = false;
                }
            }
        }

    }

    var i = this.children.length;

    while (i--)
    {
        if (this.children[i].exists)
        {
            this.children[i].update();
        }
    }

};

/**
* This function generates a new set of particles for use by this emitter.
* The particles are stored internally waiting to be emitted via Emitter.start.
*
* @method Phaser.Particles.Arcade.Emitter#makeParticles
* @param {array|string} keys - A string or an array of strings that the particle sprites will use as their texture. If an array one is picked at random.
* @param {array|number} [frames=0] - A frame number, or array of frames that the sprite will use. If an array one is picked at random.
* @param {number} [quantity] - The number of particles to generate. If not given it will use the value of Emitter.maxParticles. If the value is greater than Emitter.maxParticles it will use Emitter.maxParticles as the quantity.
* @param {boolean} [collide=false] - If you want the particles to be able to collide with other Arcade Physics bodies then set this to true.
* @param {boolean} [collideWorldBounds=false] - A particle can be set to collide against the World bounds automatically and rebound back into the World if this is set to true. Otherwise it will leave the World.
* @return {Phaser.Particles.Arcade.Emitter} This Emitter instance.
*/
Phaser.Particles.Arcade.Emitter.prototype.makeParticles = function (keys, frames, quantity, collide, collideWorldBounds) {

    if (frames === undefined) { frames = 0; }
    if (quantity === undefined) { quantity = this.maxParticles; }
    if (collide === undefined) { collide = false; }
    if (collideWorldBounds === undefined) { collideWorldBounds = false; }

    var particle;
    var i = 0;
    var rndKey = keys;
    var rndFrame = frames;
    this._frames = frames;

    if (quantity > this.maxParticles)
    {
        this.maxParticles = quantity;
    }

    while (i < quantity)
    {
        if (Array.isArray(keys))
        {
            rndKey = this.game.rnd.pick(keys);
        }

        if (Array.isArray(frames))
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
        particle.body.skipQuadTree = true;

        particle.exists = false;
        particle.visible = false;
        particle.anchor.copyFrom(this.particleAnchor);

        this.add(particle);

        i++;
    }

    return this;

};

/**
* Call this function to turn off all the particles and the emitter.
*
* @method Phaser.Particles.Arcade.Emitter#kill
*/
Phaser.Particles.Arcade.Emitter.prototype.kill = function () {

    this.on = false;
    this.alive = false;
    this.exists = false;

};

/**
* Handy for bringing game objects "back to life". Just sets alive and exists back to true.
*
* @method Phaser.Particles.Arcade.Emitter#revive
*/
Phaser.Particles.Arcade.Emitter.prototype.revive = function () {

    this.alive = true;
    this.exists = true;

};

/**
* Call this function to emit the given quantity of particles at all once (an explosion)
* 
* @method Phaser.Particles.Arcade.Emitter#explode
* @param {number} [lifespan=0] - How long each particle lives once emitted in ms. 0 = forever.
* @param {number} [quantity=0] - How many particles to launch.
*/
Phaser.Particles.Arcade.Emitter.prototype.explode = function (lifespan, quantity) {

    this._flowTotal = 0;

    this.start(true, lifespan, 0, quantity, false);

};

/**
* Call this function to start emitting a flow of particles at the given frequency.
* It will carry on going until the total given is reached.
* Each time the flow is run the quantity number of particles will be emitted together.
* If you set the total to be 20 and quantity to be 5 then flow will emit 4 times in total (4 x 5 = 20 total)
* If you set the total to be -1 then no quantity cap is used and it will keep emitting.
* 
* @method Phaser.Particles.Arcade.Emitter#flow
* @param {number} [lifespan=0] - How long each particle lives once emitted in ms. 0 = forever.
* @param {number} [frequency=250] - Frequency is how often to emit the particles, given in ms.
* @param {number} [quantity=1] - How many particles to launch each time the frequency is met. Can never be > Emitter.maxParticles.
* @param {number} [total=-1] - How many particles to launch in total. If -1 it will carry on indefinitely.
* @param {boolean} [immediate=true] - Should the flow start immediately (true) or wait until the first frequency event? (false)
*/
Phaser.Particles.Arcade.Emitter.prototype.flow = function (lifespan, frequency, quantity, total, immediate) {

    if (quantity === undefined || quantity === 0) { quantity = 1; }
    if (total === undefined) { total = -1; }
    if (immediate === undefined) { immediate = true; }

    if (quantity > this.maxParticles)
    {
        quantity = this.maxParticles;
    }

    this._counter = 0;
    this._flowQuantity = quantity;
    this._flowTotal = total;

    if (immediate)
    {
        this.start(true, lifespan, frequency, quantity);

        this._counter += quantity;
        this.on = true;
        this._timer = this.game.time.time + frequency * this.game.time.slowMotion;
    }
    else
    {
        this.start(false, lifespan, frequency, quantity);
    }

};

/**
* Call this function to start emitting particles.
* 
* @method Phaser.Particles.Arcade.Emitter#start
* @param {boolean} [explode=true] - Whether the particles should all burst out at once (true) or at the frequency given (false).
* @param {number} [lifespan=0] - How long each particle lives once emitted in ms. 0 = forever.
* @param {number} [frequency=250] - Ignored if Explode is set to true. Frequency is how often to emit 1 particle. Value given in ms.
* @param {number} [quantity=0] - How many particles to launch. 0 = "all of the particles" which will keep emitting until Emitter.maxParticles is reached.
* @param {number} [forceQuantity=false] - If `true` and creating a particle flow, the quantity emitted will be forced to the be quantity given in this call. This can never exceed Emitter.maxParticles.
*/
Phaser.Particles.Arcade.Emitter.prototype.start = function (explode, lifespan, frequency, quantity, forceQuantity) {

    if (explode === undefined) { explode = true; }
    if (lifespan === undefined) { lifespan = 0; }
    if (frequency === undefined || frequency === null) { frequency = 250; }
    if (quantity === undefined) { quantity = 0; }
    if (forceQuantity === undefined) { forceQuantity = false; }

    if (quantity > this.maxParticles)
    {
        quantity = this.maxParticles;
    }

    this.revive();

    this.visible = true;

    this.lifespan = lifespan;
    this.frequency = frequency;

    if (explode || forceQuantity)
    {
        for (var i = 0; i < quantity; i++)
        {
            this.emitParticle();
        }
    }
    else
    {
        this.on = true;
        this._quantity += quantity;
        this._counter = 0;
        this._timer = this.game.time.time + frequency * this.game.time.slowMotion;
    }

};

/**
* This function is used internally to emit the next particle in the queue.
*
* However it can also be called externally to emit a particle.
*
* When called externally you can use the arguments to override any defaults the Emitter has set.
*
* @method Phaser.Particles.Arcade.Emitter#emitParticle
* @param {number} [x] - The x coordinate to emit the particle from. If `null` or `undefined` it will use `Emitter.emitX` or if the Emitter has a width > 1 a random value between `Emitter.left` and `Emitter.right`.
* @param {number} [y] - The y coordinate to emit the particle from. If `null` or `undefined` it will use `Emitter.emitY` or if the Emitter has a height > 1 a random value between `Emitter.top` and `Emitter.bottom`.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|Phaser.Video|PIXI.Texture} [key] - This is the image or texture used by the Particle during rendering. It can be a string which is a reference to the Cache Image entry, or an instance of a RenderTexture, BitmapData, Video or PIXI.Texture.
* @param {string|number} [frame] - If this Particle is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
* @return {boolean} True if a particle was emitted, otherwise false.
*/
Phaser.Particles.Arcade.Emitter.prototype.emitParticle = function (x, y, key, frame) {

    if (x === undefined) { x = null; }
    if (y === undefined) { y = null; }

    var particle = this.getFirstExists(false);

    if (particle === null)
    {
        return false;
    }

    var rnd = this.game.rnd;

    if (key !== undefined && frame !== undefined)
    {
        particle.loadTexture(key, frame);
    }
    else if (key !== undefined)
    {
        particle.loadTexture(key);
    }

    var emitX = this.emitX;
    var emitY = this.emitY;

    if (x !== null)
    {
        emitX = x;
    }
    else if (this.width > 1)
    {
        emitX = rnd.between(this.left, this.right);
    }

    if (y !== null)
    {
        emitY = y;
    }
    else if (this.height > 1)
    {
        emitY = rnd.between(this.top, this.bottom);
    }

    particle.reset(emitX, emitY);

    particle.angle = 0;
    particle.lifespan = this.lifespan;

    if (this.particleBringToTop)
    {
        this.bringToTop(particle);
    }
    else if (this.particleSendToBack)
    {
        this.sendToBack(particle);
    }

    if (this.autoScale)
    {
        particle.setScaleData(this.scaleData);
    }
    else if (this.minParticleScale !== 1 || this.maxParticleScale !== 1)
    {
        particle.scale.set(rnd.realInRange(this.minParticleScale, this.maxParticleScale));
    }
    else if ((this._minParticleScale.x !== this._maxParticleScale.x) || (this._minParticleScale.y !== this._maxParticleScale.y))
    {
        particle.scale.set(rnd.realInRange(this._minParticleScale.x, this._maxParticleScale.x), rnd.realInRange(this._minParticleScale.y, this._maxParticleScale.y));
    }

    if (frame === undefined)
    {
        if (Array.isArray(this._frames))
        {
            particle.frame = this.game.rnd.pick(this._frames);
        }
        else
        {
            particle.frame = this._frames;
        }
    }

    if (this.autoAlpha)
    {
        particle.setAlphaData(this.alphaData);
    }
    else
    {
        particle.alpha = rnd.realInRange(this.minParticleAlpha, this.maxParticleAlpha);
    }

    particle.blendMode = this.blendMode;

    var body = particle.body;

    body.updateBounds();

    body.bounce.copyFrom(this.bounce);
    body.drag.copyFrom(this.particleDrag);

    body.velocity.x = rnd.between(this.minParticleSpeed.x, this.maxParticleSpeed.x);
    body.velocity.y = rnd.between(this.minParticleSpeed.y, this.maxParticleSpeed.y);
    body.angularVelocity = rnd.between(this.minRotation, this.maxRotation);

    body.gravity.y = this.gravity;
    body.angularDrag = this.angularDrag;

    particle.onEmit();

    return true;

};

/**
* Destroys this Emitter, all associated child Particles and then removes itself from the Particle Manager.
* 
* @method Phaser.Particles.Arcade.Emitter#destroy
*/
Phaser.Particles.Arcade.Emitter.prototype.destroy = function () {

    this.game.particles.remove(this);

    Phaser.Group.prototype.destroy.call(this, true, false);

};

/**
* A more compact way of setting the width and height of the emitter.
* 
* @method Phaser.Particles.Arcade.Emitter#setSize
* @param {number} width - The desired width of the emitter (particles are spawned randomly within these dimensions).
* @param {number} height - The desired height of the emitter.
*/
Phaser.Particles.Arcade.Emitter.prototype.setSize = function (width, height) {

    this.area.width = width;
    this.area.height = height;

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
* A more compact way of setting the angular velocity constraints of the particles.
*
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
* A more compact way of setting the alpha constraints of the particles.
* The rate parameter, if set to a value above zero, lets you set the speed at which the Particle change in alpha from min to max.
* If rate is zero, which is the default, the particle won't change alpha - instead it will pick a random alpha between min and max on emit.
*
* @method Phaser.Particles.Arcade.Emitter#setAlpha
* @param {number} [min=1] - The minimum value for this range.
* @param {number} [max=1] - The maximum value for this range.
* @param {number} [rate=0] - The rate (in ms) at which the particles will change in alpha from min to max, or set to zero to pick a random alpha between the two.
* @param {function} [ease=Phaser.Easing.Linear.None] - If you've set a rate > 0 this is the easing formula applied between the min and max values.
* @param {boolean} [yoyo=false] - If you've set a rate > 0 you can set if the ease will yoyo or not (i.e. ease back to its original values)
*/
Phaser.Particles.Arcade.Emitter.prototype.setAlpha = function (min, max, rate, ease, yoyo) {

    if (min === undefined) { min = 1; }
    if (max === undefined) { max = 1; }
    if (rate === undefined) { rate = 0; }
    if (ease === undefined) { ease = Phaser.Easing.Linear.None; }
    if (yoyo === undefined) { yoyo = false; }

    this.minParticleAlpha = min;
    this.maxParticleAlpha = max;
    this.autoAlpha = false;

    if (rate > 0 && min !== max)
    {
        var tweenData = { v: min };
        var tween = this.game.make.tween(tweenData).to( { v: max }, rate, ease);
        tween.yoyo(yoyo);

        this.alphaData = tween.generateData(60);

        //  Inverse it so we don't have to do array length look-ups in Particle update loops
        this.alphaData.reverse();
        this.autoAlpha = true;
    }

};

/**
* A more compact way of setting the scale constraints of the particles.
* The rate parameter, if set to a value above zero, lets you set the speed and ease which the Particle uses to change in scale from min to max across both axis.
* If rate is zero, which is the default, the particle won't change scale during update, instead it will pick a random scale between min and max on emit.
*
* @method Phaser.Particles.Arcade.Emitter#setScale
* @param {number} [minX=1] - The minimum value of Particle.scale.x.
* @param {number} [maxX=1] - The maximum value of Particle.scale.x.
* @param {number} [minY=1] - The minimum value of Particle.scale.y.
* @param {number} [maxY=1] - The maximum value of Particle.scale.y.
* @param {number} [rate=0] - The rate (in ms) at which the particles will change in scale from min to max, or set to zero to pick a random size between the two.
* @param {function} [ease=Phaser.Easing.Linear.None] - If you've set a rate > 0 this is the easing formula applied between the min and max values.
* @param {boolean} [yoyo=false] - If you've set a rate > 0 you can set if the ease will yoyo or not (i.e. ease back to its original values)
*/
Phaser.Particles.Arcade.Emitter.prototype.setScale = function (minX, maxX, minY, maxY, rate, ease, yoyo) {

    if (minX === undefined) { minX = 1; }
    if (maxX === undefined) { maxX = 1; }
    if (minY === undefined) { minY = 1; }
    if (maxY === undefined) { maxY = 1; }
    if (rate === undefined) { rate = 0; }
    if (ease === undefined) { ease = Phaser.Easing.Linear.None; }
    if (yoyo === undefined) { yoyo = false; }

    //  Reset these
    this.minParticleScale = 1;
    this.maxParticleScale = 1;

    this._minParticleScale.set(minX, minY);
    this._maxParticleScale.set(maxX, maxY);

    this.autoScale = false;

    if (rate > 0 && ((minX !== maxX) || (minY !== maxY)))
    {
        var tweenData = { x: minX, y: minY };
        var tween = this.game.make.tween(tweenData).to( { x: maxX, y: maxY }, rate, ease);
        tween.yoyo(yoyo);

        this.scaleData = tween.generateData(60);

        //  Inverse it so we don't have to do array length look-ups in Particle update loops
        this.scaleData.reverse();
        this.autoScale = true;
    }

};

/**
* Change the emitters center to match the center of any object with a `center` property, such as a Sprite.
* If the object doesn't have a center property it will be set to object.x + object.width / 2
*
* @method Phaser.Particles.Arcade.Emitter#at
* @param {object|Phaser.Sprite|Phaser.Image|Phaser.TileSprite|Phaser.Text|PIXI.DisplayObject} object - The object that you wish to match the center with.
*/
Phaser.Particles.Arcade.Emitter.prototype.at = function (object) {

    if (object.center)
    {
        this.emitX = object.center.x;
        this.emitY = object.center.y;
    }
    else
    {
        this.emitX = object.world.x + (object.anchor.x * object.width);
        this.emitY = object.world.y + (object.anchor.y * object.height);
    }

};

/**
* @name Phaser.Particles.Arcade.Emitter#width
* @property {number} width - Gets or sets the width of the Emitter. This is the region in which a particle can be emitted.
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "width", {

    get: function () {
        return this.area.width;
    },

    set: function (value) {
        this.area.width = value;
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#height
* @property {number} height - Gets or sets the height of the Emitter. This is the region in which a particle can be emitted.
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "height", {

    get: function () {
        return this.area.height;
    },

    set: function (value) {
        this.area.height = value;
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
        return Math.floor(this.x - (this.area.width / 2));
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#right
* @property {number} right - Gets the right position of the Emitter.
* @readonly
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "right", {

    get: function () {
        return Math.floor(this.x + (this.area.width / 2));
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#top
* @property {number} top - Gets the top position of the Emitter.
* @readonly
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "top", {

    get: function () {
        return Math.floor(this.y - (this.area.height / 2));
    }

});

/**
* @name Phaser.Particles.Arcade.Emitter#bottom
* @property {number} bottom - Gets the bottom position of the Emitter.
* @readonly
*/
Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype, "bottom", {

    get: function () {
        return Math.floor(this.y + (this.area.height / 2));
    }

});
