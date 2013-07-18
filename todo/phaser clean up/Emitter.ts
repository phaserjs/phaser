/// <reference path="../Game.ts" />
/// <reference path="../Group.ts" />

/**
* Phaser - Emitter
*
* Emitter is a lightweight particle emitter. It can be used for one-time explosions or for
* continuous effects like rain and fire. All it really does is launch Particle objects out
* at set intervals, and fixes their positions and velocities accorindgly.
*/

module Phaser {

    export class Emitter extends Group {

        /**
         * Creates a new <code>Emitter</code> object at a specific position.
         * Does NOT automatically generate or attach particles!
         *
         * @param x {number} The X position of the emitter.
         * @param y {number} The Y position of the emitter.
         * @param [size] {number} Specifies a maximum capacity for this emitter.
         */
        constructor(game: Game, x: number = 0, y: number = 0, size: number = 0) {

            super(game, size);

            this.x = x;
            this.y = y;
            this.width = 0;
            this.height = 0;
            this.minParticleSpeed = new MicroPoint(-100, -100);
            this.maxParticleSpeed = new MicroPoint(100, 100);
            this.minRotation = -360;
            this.maxRotation = 360;
            this.gravity = 0;
            this.particleClass = null;
            this.particleDrag = new MicroPoint();
            this.frequency = 0.1;
            this.lifespan = 3;
            this.bounce = 0;
            this._quantity = 0;
            this._counter = 0;
            this._explode = true;
            this.on = false;
            this._point = new MicroPoint();

        }

        /**
         * The X position of the top left corner of the emitter in world space.
         */
        public x: number;

        /**
         * The Y position of the top left corner of emitter in world space.
         */
        public y: number;

        /**
         * The width of the emitter.  Particles can be randomly generated from anywhere within this box.
         */
        public width: number;

        /**
         * The height of the emitter.  Particles can be randomly generated from anywhere within this box.
         */
        public height: number;

        /**
         * The minimum possible velocity of a particle.
         * The default value is (-100,-100).
         */
        public minParticleSpeed: MicroPoint;

        /**
         * The maximum possible velocity of a particle.
         * The default value is (100,100).
         */
        public maxParticleSpeed: MicroPoint;

        /**
         * The X and Y drag component of particles launched from the emitter.
         */
        public particleDrag: MicroPoint;

        /**
         * The minimum possible angular velocity of a particle.  The default value is -360.
         * NOTE: rotating particles are more expensive to draw than non-rotating ones!
         */
        public minRotation: number;

        /**
         * The maximum possible angular velocity of a particle.  The default value is 360.
         * NOTE: rotating particles are more expensive to draw than non-rotating ones!
         */
        public maxRotation: number;

        /**
         * Sets the <code>acceleration.y</code> member of each particle to this value on launch.
         */
        public gravity: number;

        /**
         * Determines whether the emitter is currently emitting particles.
         * It is totally safe to directly toggle this.
         */
        public on: bool;

        /**
         * How often a particle is emitted (if emitter is started with Explode == false).
         */
        public frequency: number;

        /**
         * How long each particle lives once it is emitted.
         * Set lifespan to 'zero' for particles to live forever.
         */
        public lifespan: number;

        /**
         * How much each particle should bounce.  1 = full bounce, 0 = no bounce.
         */
        public bounce: number;

        /**
         * Set your own particle class type here.
         * Default is <code>Particle</code>.
         */
        public particleClass;

        /**
         * Internal helper for deciding how many particles to launch.
         */
        private _quantity: number;

        /**
         * Internal helper for the style of particle emission (all at once, or one at a time).
         */
        private _explode: bool;

        /**
         * Internal helper for deciding when to launch particles or kill them.
         */
        private _timer: number;

        /**
         * Internal counter for figuring out how many particles to launch.
         */
        private _counter: number;

        /**
         * Internal point object, handy for reusing for memory mgmt purposes.
         */
        private _point: MicroPoint;

        /**
         * Clean up memory.
         */
        public destroy() {
            this.minParticleSpeed = null;
            this.maxParticleSpeed = null;
            this.particleDrag = null;
            this.particleClass = null;
            this._point = null;
            super.destroy();
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
        public makeParticles(graphics, quantity: number = 50, multiple: bool = false, collide: number = 0): Emitter {

            this.maxSize = quantity;

            var totalFrames: number = 1;

            /*
            if(Multiple)
            {
                var sprite:Sprite = new Sprite(this._game);
                sprite.loadGraphic(Graphics,true);
                totalFrames = sprite.frames;
                sprite.destroy();
            }
            */

            var randomFrame: number;
            var particle: Particle;
            var i: number = 0;

            while (i < quantity)
            {
                if (this.particleClass == null)
                {
                    particle = new Particle(this._game);
                }
                else
                {
                    particle = new this.particleClass(this._game);
                }

                if (multiple)
                {
                    /*
                    randomFrame = this._game.math.random()*totalFrames;
                    if(BakedRotations > 0)
                        particle.loadRotatedGraphic(Graphics,BakedRotations,randomFrame);
                    else
                    {
                        particle.loadGraphic(Graphics,true);
                        particle.frame = randomFrame;
                    }
                    */
                }
                else
                {
                    /*
                    if (BakedRotations > 0)
                        particle.loadRotatedGraphic(Graphics,BakedRotations);
                    else
                        particle.loadGraphic(Graphics);
                    */

                    if (graphics)
                    {
                        particle.loadGraphic(graphics);
                    }

                }

                if (collide > 0)
                {
                    particle.allowCollisions = Collision.ANY;
                    particle.width *= collide;
                    particle.height *= collide;
                    //particle.centerOffsets();
                }
                else
                {
                    particle.allowCollisions = Collision.NONE;
                }

                particle.exists = false;

                this.add(particle);

                i++;
            }

            return this;
        }

        /**
         * Called automatically by the game loop, decides when to launch particles and when to "die".
         */
        public update() {

            if (this.on)
            {
                if (this._explode)
                {
                    this.on = false;

                    var i: number = 0;
                    var l: number = this._quantity;

                    if ((l <= 0) || (l > this.length))
                    {
                        l = this.length;
                    }

                    while (i < l)
                    {
                        this.emitParticle();
                        i++;
                    }

                    this._quantity = 0;
                }
                else
                {
                    this._timer += this._game.time.elapsed;

                    while ((this.frequency > 0) && (this._timer > this.frequency) && this.on)
                    {
                        this._timer -= this.frequency;
                        this.emitParticle();

                        if ((this._quantity > 0) && (++this._counter >= this._quantity))
                        {
                            this.on = false;
                            this._quantity = 0;
                        }
                    }
                }
            }

            super.update();

        }

        /**
         * Call this function to turn off all the particles and the emitter.
         */
        public kill() {

            this.on = false;

            super.kill();

        }

        /**
         * Call this function to start emitting particles.
         *
         * @param explode {boolean} Whether the particles should all burst out at once.
         * @param lifespan {number} How long each particle lives once emitted. 0 = forever.
         * @param frequency {number} Ignored if Explode is set to true. Frequency is how often to emit a particle. 0 = never emit, 0.1 = 1 particle every 0.1 seconds, 5 = 1 particle every 5 seconds.
         * @param quantity {number} How many particles to launch. 0 = "all of the particles".
         */
        public start(explode: bool = true, lifespan: number = 0, frequency: number = 0.1, quantity: number = 0) {

            this.revive();

            this.visible = true;
            this.on = true;

            this._explode = explode;
            this.lifespan = lifespan;
            this.frequency = frequency;
            this._quantity += quantity;

            this._counter = 0;
            this._timer = 0;

        }

        /**
         * This function can be used both internally and externally to emit the next particle.
         */
        public emitParticle() {

            var particle: Particle = this.recycle(Particle);

            particle.lifespan = this.lifespan;
            particle.elasticity = this.bounce;
            particle.reset(this.x - (particle.width >> 1) + this._game.math.random() * this.width, this.y - (particle.height >> 1) + this._game.math.random() * this.height);
            particle.visible = true;

            if (this.minParticleSpeed.x != this.maxParticleSpeed.x)
            {
                particle.velocity.x = this.minParticleSpeed.x + this._game.math.random() * (this.maxParticleSpeed.x - this.minParticleSpeed.x);
            }
            else
            {
                particle.velocity.x = this.minParticleSpeed.x;
            }

            if (this.minParticleSpeed.y != this.maxParticleSpeed.y)
            {
                particle.velocity.y = this.minParticleSpeed.y + this._game.math.random() * (this.maxParticleSpeed.y - this.minParticleSpeed.y);
            }
            else
            {
                particle.velocity.y = this.minParticleSpeed.y;
            }

            particle.acceleration.y = this.gravity;

            if (this.minRotation != this.maxRotation && this.minRotation !== 0 && this.maxRotation !== 0)
            {
                particle.angularVelocity = this.minRotation + this._game.math.random() * (this.maxRotation - this.minRotation);
            }
            else
            {
                particle.angularVelocity = this.minRotation;
            }

            if (particle.angularVelocity != 0)
            {
                particle.angle = this._game.math.random() * 360 - 180;
            }

            particle.drag.x = this.particleDrag.x;
            particle.drag.y = this.particleDrag.y;
            particle.onEmit();

        }

        /**
         * A more compact way of setting the width and height of the emitter.
         *
         * @param width {number} The desired width of the emitter (particles are spawned randomly within these dimensions).
         * @param height {number} The desired height of the emitter.
         */
        public setSize(width: number, height: number) {
            this.width = width;
            this.height = height;
        }

        /**
         * A more compact way of setting the X velocity range of the emitter.
         *
         * @param Min {number} The minimum value for this range.
         * @param Max {number} The maximum value for this range.
         */
        public setXSpeed(min: number = 0, max: number = 0) {
            this.minParticleSpeed.x = min;
            this.maxParticleSpeed.x = max;
        }

        /**
         * A more compact way of setting the Y velocity range of the emitter.
         *
         * @param Min {number} The minimum value for this range.
         * @param Max {number} The maximum value for this range.
         */
        public setYSpeed(min: number = 0, max: number = 0) {
            this.minParticleSpeed.y = min;
            this.maxParticleSpeed.y = max;
        }

        /**
         * A more compact way of setting the angular velocity constraints of the emitter.
         *
         * @param Min {number} The minimum value for this range.
         * @param Max {number} The maximum value for this range.
         */
        public setRotation(min: number = 0, max: number = 0) {
            this.minRotation = min;
            this.maxRotation = max;
        }

        /**
         * Change the emitter's midpoint to match the midpoint of a <code>Object</code>.
         *
         * @param Object {object} The <code>Object</code> that you want to sync up with.
         */
        public at(object) {
            object.getMidpoint(this._point);
            this.x = this._point.x - (this.width >> 1);
            this.y = this._point.y - (this.height >> 1);
        }
    }

}