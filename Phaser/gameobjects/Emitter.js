var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../Game.ts" />
/// <reference path="../Group.ts" />
/**
* Phaser - Emitter
*
* Emitter is a lightweight particle emitter. It can be used for one-time explosions or for
* continuous effects like rain and fire. All it really does is launch Particle objects out
* at set intervals, and fixes their positions and velocities accorindgly.
*/
var Phaser;
(function (Phaser) {
    var Emitter = (function (_super) {
        __extends(Emitter, _super);
        /**
        * Creates a new <code>Emitter</code> object at a specific position.
        * Does NOT automatically generate or attach particles!
        *
        * @param x {number} The X position of the emitter.
        * @param y {number} The Y position of the emitter.
        * @param [size] {number} Specifies a maximum capacity for this emitter.
        */
        function Emitter(game, x, y, size) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof size === "undefined") { size = 0; }
            _super.call(this, game, size);
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
        Emitter.prototype.destroy = /**
        * Clean up memory.
        */
        function () {
            this.minParticleSpeed = null;
            this.maxParticleSpeed = null;
            this.particleDrag = null;
            this.particleClass = null;
            this._point = null;
            _super.prototype.destroy.call(this);
        };
        Emitter.prototype.makeParticles = /**
        * This function generates a new array of particle sprites to attach to the emitter.
        *
        * @param graphics If you opted to not pre-configure an array of Sprite objects, you can simply pass in a particle image or sprite sheet.
        * @param quantity {number} The number of particles to generate when using the "create from image" option.
        * @param multiple {boolean} Whether the image in the Graphics param is a single particle or a bunch of particles (if it's a bunch, they need to be square!).
        * @param collide {number}  Whether the particles should be flagged as not 'dead' (non-colliding particles are higher performance).  0 means no collisions, 0-1 controls scale of particle's bounding box.
        *
        * @return  This Emitter instance (nice for chaining stuff together, if you're into that).
        */
        function (graphics, quantity, multiple, collide) {
            if (typeof quantity === "undefined") { quantity = 50; }
            if (typeof multiple === "undefined") { multiple = false; }
            if (typeof collide === "undefined") { collide = 0; }
            this.maxSize = quantity;
            var totalFrames = 1;
            /*
            if(Multiple)
            {
            var sprite:Sprite = new Sprite(this._game);
            sprite.loadGraphic(Graphics,true);
            totalFrames = sprite.frames;
            sprite.destroy();
            }
            */
            var randomFrame;
            var particle;
            var i = 0;
            while(i < quantity) {
                if(this.particleClass == null) {
                    particle = new Phaser.Particle(this._game);
                } else {
                    particle = new this.particleClass(this._game);
                }
                if(multiple) {
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
                                    } else {
                    /*
                    if (BakedRotations > 0)
                    particle.loadRotatedGraphic(Graphics,BakedRotations);
                    else
                    particle.loadGraphic(Graphics);
                    */
                    if(graphics) {
                        particle.loadGraphic(graphics);
                    }
                }
                if(collide > 0) {
                    particle.allowCollisions = Phaser.Collision.ANY;
                    particle.width *= collide;
                    particle.height *= collide;
                    //particle.centerOffsets();
                                    } else {
                    particle.allowCollisions = Phaser.Collision.NONE;
                }
                particle.exists = false;
                this.add(particle);
                i++;
            }
            return this;
        };
        Emitter.prototype.update = /**
        * Called automatically by the game loop, decides when to launch particles and when to "die".
        */
        function () {
            if(this.on) {
                if(this._explode) {
                    this.on = false;
                    var i = 0;
                    var l = this._quantity;
                    if((l <= 0) || (l > this.length)) {
                        l = this.length;
                    }
                    while(i < l) {
                        this.emitParticle();
                        i++;
                    }
                    this._quantity = 0;
                } else {
                    this._timer += this._game.time.elapsed;
                    while((this.frequency > 0) && (this._timer > this.frequency) && this.on) {
                        this._timer -= this.frequency;
                        this.emitParticle();
                        if((this._quantity > 0) && (++this._counter >= this._quantity)) {
                            this.on = false;
                            this._quantity = 0;
                        }
                    }
                }
            }
            _super.prototype.update.call(this);
        };
        Emitter.prototype.kill = /**
        * Call this function to turn off all the particles and the emitter.
        */
        function () {
            this.on = false;
            _super.prototype.kill.call(this);
        };
        Emitter.prototype.start = /**
        * Call this function to start emitting particles.
        *
        * @param explode {boolean} Whether the particles should all burst out at once.
        * @param lifespan {number} How long each particle lives once emitted. 0 = forever.
        * @param frequency {number} Ignored if Explode is set to true. Frequency is how often to emit a particle. 0 = never emit, 0.1 = 1 particle every 0.1 seconds, 5 = 1 particle every 5 seconds.
        * @param quantity {number} How many particles to launch. 0 = "all of the particles".
        */
        function (explode, lifespan, frequency, quantity) {
            if (typeof explode === "undefined") { explode = true; }
            if (typeof lifespan === "undefined") { lifespan = 0; }
            if (typeof frequency === "undefined") { frequency = 0.1; }
            if (typeof quantity === "undefined") { quantity = 0; }
            this.revive();
            this.visible = true;
            this.on = true;
            this._explode = explode;
            this.lifespan = lifespan;
            this.frequency = frequency;
            this._quantity += quantity;
            this._counter = 0;
            this._timer = 0;
        };
        Emitter.prototype.emitParticle = /**
        * This function can be used both internally and externally to emit the next particle.
        */
        function () {
            var particle = this.recycle(Phaser.Particle);
            particle.lifespan = this.lifespan;
            particle.elasticity = this.bounce;
            particle.reset(this.x - (particle.width >> 1) + this._game.math.random() * this.width, this.y - (particle.height >> 1) + this._game.math.random() * this.height);
            particle.visible = true;
            if(this.minParticleSpeed.x != this.maxParticleSpeed.x) {
                particle.velocity.x = this.minParticleSpeed.x + this._game.math.random() * (this.maxParticleSpeed.x - this.minParticleSpeed.x);
            } else {
                particle.velocity.x = this.minParticleSpeed.x;
            }
            if(this.minParticleSpeed.y != this.maxParticleSpeed.y) {
                particle.velocity.y = this.minParticleSpeed.y + this._game.math.random() * (this.maxParticleSpeed.y - this.minParticleSpeed.y);
            } else {
                particle.velocity.y = this.minParticleSpeed.y;
            }
            particle.acceleration.y = this.gravity;
            if(this.minRotation != this.maxRotation && this.minRotation !== 0 && this.maxRotation !== 0) {
                particle.angularVelocity = this.minRotation + this._game.math.random() * (this.maxRotation - this.minRotation);
            } else {
                particle.angularVelocity = this.minRotation;
            }
            if(particle.angularVelocity != 0) {
                particle.angle = this._game.math.random() * 360 - 180;
            }
            particle.drag.x = this.particleDrag.x;
            particle.drag.y = this.particleDrag.y;
            particle.onEmit();
        };
        Emitter.prototype.setSize = /**
        * A more compact way of setting the width and height of the emitter.
        *
        * @param width {number} The desired width of the emitter (particles are spawned randomly within these dimensions).
        * @param height {number} The desired height of the emitter.
        */
        function (width, height) {
            this.width = width;
            this.height = height;
        };
        Emitter.prototype.setXSpeed = /**
        * A more compact way of setting the X velocity range of the emitter.
        *
        * @param Min {number} The minimum value for this range.
        * @param Max {number} The maximum value for this range.
        */
        function (min, max) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 0; }
            this.minParticleSpeed.x = min;
            this.maxParticleSpeed.x = max;
        };
        Emitter.prototype.setYSpeed = /**
        * A more compact way of setting the Y velocity range of the emitter.
        *
        * @param Min {number} The minimum value for this range.
        * @param Max {number} The maximum value for this range.
        */
        function (min, max) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 0; }
            this.minParticleSpeed.y = min;
            this.maxParticleSpeed.y = max;
        };
        Emitter.prototype.setRotation = /**
        * A more compact way of setting the angular velocity constraints of the emitter.
        *
        * @param Min {number} The minimum value for this range.
        * @param Max {number} The maximum value for this range.
        */
        function (min, max) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 0; }
            this.minRotation = min;
            this.maxRotation = max;
        };
        Emitter.prototype.at = /**
        * Change the emitter's midpoint to match the midpoint of a <code>Object</code>.
        *
        * @param Object {object} The <code>Object</code> that you want to sync up with.
        */
        function (object) {
            object.getMidpoint(this._point);
            this.x = this._point.x - (this.width >> 1);
            this.y = this._point.y - (this.height >> 1);
        };
        return Emitter;
    })(Phaser.Group);
    Phaser.Emitter = Emitter;    
})(Phaser || (Phaser = {}));
