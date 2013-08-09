/// <reference path="../_definitions.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Phaser - ArcadeEmitter
*
* Emitter is a lightweight particle emitter. It can be used for one-time explosions or for
* continuous effects like rain and fire. All it really does is launch Particle objects out
* at set intervals, and fixes their positions and velocities accorindgly.
*/
var Phaser;
(function (Phaser) {
    var ArcadeEmitter = (function (_super) {
        __extends(ArcadeEmitter, _super);
        /**
        * Creates a new <code>Emitter</code> object at a specific position.
        * Does NOT automatically generate or attach particles!
        *
        * @param x {number} The X position of the emitter.
        * @param y {number} The Y position of the emitter.
        * @param [size] {number} Specifies a maximum capacity for this emitter.
        */
        function ArcadeEmitter(game, x, y, size) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof size === "undefined") { size = 0; }
            _super.call(this, game, size);

            this.x = x;
            this.y = y;
            this.width = 0;
            this.height = 0;
            this.minParticleSpeed = new Phaser.Vec2(-100, -100);
            this.maxParticleSpeed = new Phaser.Vec2(100, 100);
            this.minRotation = -360;
            this.maxRotation = 360;
            this.gravity = 0;
            this.particleClass = null;
            this.particleDrag = new Phaser.Vec2();
            this.frequency = 0.1;
            this.lifespan = 3;
            this.bounce = 0;
            this._quantity = 0;
            this._counter = 0;
            this._explode = true;
            this.on = false;

            this.exists = true;
            this.active = true;
            this.visible = true;
        }
        /**
        * Clean up memory.
        */
        ArcadeEmitter.prototype.destroy = function () {
            this.minParticleSpeed = null;
            this.maxParticleSpeed = null;
            this.particleDrag = null;
            this.particleClass = null;
            this._point = null;
            _super.prototype.destroy.call(this);
        };

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
        ArcadeEmitter.prototype.makeParticles = function (graphics, quantity, multiple, collide) {
            if (typeof quantity === "undefined") { quantity = 50; }
            if (typeof multiple === "undefined") { multiple = false; }
            if (typeof collide === "undefined") { collide = 0; }
            this.maxSize = quantity;

            var totalFrames = 1;

            /*
            if(Multiple)
            {
            var sprite:Sprite = new Sprite(this.game);
            sprite.loadGraphic(Graphics,true);
            totalFrames = sprite.frames;
            sprite.destroy();
            }
            */
            var randomFrame;
            var particle;
            var i = 0;

            while (i < quantity) {
                if (this.particleClass == null) {
                    particle = new Phaser.ArcadeParticle(this.game);
                } else {
                    particle = new this.particleClass(this.game);
                }

                if (multiple) {
                    /*
                    randomFrame = this.game.math.random()*totalFrames;
                    */
                } else {
                    if (graphics) {
                        particle.texture.loadImage(graphics);
                    }
                }

                if (collide > 0) {
                    //particle.body.allowCollisions = Types.ANY;
                    particle.body.type = Phaser.Types.BODY_DYNAMIC;
                    particle.width *= collide;
                    particle.height *= collide;
                } else {
                    //particle.body.allowCollisions = Types.NONE;
                }

                particle.exists = false;

                //  Center the origin for rotation assistance
                //particle.transform.origin.setTo(particle.body.bounds.halfWidth, particle.body.bounds.halfHeight);
                this.add(particle);

                i++;
            }

            return this;
        };

        ArcadeEmitter.prototype.preUpdate = function () {
        };
        ArcadeEmitter.prototype.postUpdate = function () {
        };

        /**
        * Called automatically by the game loop, decides when to launch particles and when to "die".
        */
        ArcadeEmitter.prototype.update = function () {
            if (this.on) {
                if (this._explode) {
                    this.on = false;

                    var i = 0;
                    var l = this._quantity;

                    if ((l <= 0) || (l > this.length)) {
                        l = this.length;
                    }

                    while (i < l) {
                        this.emitParticle();
                        i++;
                    }

                    this._quantity = 0;
                } else {
                    this._timer += this.game.time.elapsed;

                    while ((this.frequency > 0) && (this._timer > this.frequency) && this.on) {
                        this._timer -= this.frequency;
                        this.emitParticle();

                        if ((this._quantity > 0) && (++this._counter >= this._quantity)) {
                            this.on = false;
                            this._quantity = 0;
                        }
                    }
                }
            }

            _super.prototype.update.call(this);
        };

        /**
        * Call this function to turn off all the particles and the emitter.
        */
        ArcadeEmitter.prototype.kill = function () {
            this.on = false;
            this.alive = false;
            this.exists = false;
        };

        /**
        * Handy for bringing game objects "back to life". Just sets alive and exists back to true.
        * In practice, this is most often called by <code>Object.reset()</code>.
        */
        ArcadeEmitter.prototype.revive = function () {
            this.alive = true;
            this.exists = true;
        };

        /**
        * Call this function to start emitting particles.
        *
        * @param explode {boolean} Whether the particles should all burst out at once.
        * @param lifespan {number} How long each particle lives once emitted. 0 = forever.
        * @param frequency {number} Ignored if Explode is set to true. Frequency is how often to emit a particle. 0 = never emit, 0.1 = 1 particle every 0.1 seconds, 5 = 1 particle every 5 seconds.
        * @param quantity {number} How many particles to launch. 0 = "all of the particles".
        */
        ArcadeEmitter.prototype.start = function (explode, lifespan, frequency, quantity) {
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

        /**
        * This function can be used both internally and externally to emit the next particle.
        */
        ArcadeEmitter.prototype.emitParticle = function () {
            var particle = this.recycle(Phaser.ArcadeParticle);

            particle.lifespan = this.lifespan;

            //particle.body.bounce.setTo(this.bounce, this.bounce);
            Phaser.SpriteUtils.reset(particle, this.x - (particle.width >> 1) + this.game.rnd.integer * this.width, this.y - (particle.height >> 1) + this.game.rnd.integer * this.height);
            particle.visible = true;

            if (this.minParticleSpeed.x != this.maxParticleSpeed.x) {
                particle.body.velocity.x = this.minParticleSpeed.x + this.game.rnd.integer * (this.maxParticleSpeed.x - this.minParticleSpeed.x);
            } else {
                particle.body.velocity.x = this.minParticleSpeed.x;
            }

            if (this.minParticleSpeed.y != this.maxParticleSpeed.y) {
                particle.body.velocity.y = this.minParticleSpeed.y + this.game.rnd.integer * (this.maxParticleSpeed.y - this.minParticleSpeed.y);
            } else {
                particle.body.velocity.y = this.minParticleSpeed.y;
            }

            if (this.minRotation != this.maxRotation && this.minRotation !== 0 && this.maxRotation !== 0) {
                particle.body.angularVelocity = this.minRotation + this.game.rnd.integer * (this.maxRotation - this.minRotation);
            } else {
                particle.body.angularVelocity = this.minRotation;
            }

            if (particle.body.angularVelocity != 0) {
                particle.rotation = this.game.rnd.integer * 360 - 180;
            }

            //particle.body.drag.x = this.particleDrag.x;
            //particle.body.drag.y = this.particleDrag.y;
            particle.onEmit();
        };

        /**
        * A more compact way of setting the width and height of the emitter.
        *
        * @param width {number} The desired width of the emitter (particles are spawned randomly within these dimensions).
        * @param height {number} The desired height of the emitter.
        */
        ArcadeEmitter.prototype.setSize = function (width, height) {
            this.width = width;
            this.height = height;
        };

        /**
        * A more compact way of setting the X velocity range of the emitter.
        *
        * @param Min {number} The minimum value for this range.
        * @param Max {number} The maximum value for this range.
        */
        ArcadeEmitter.prototype.setXSpeed = function (min, max) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 0; }
            this.minParticleSpeed.x = min;
            this.maxParticleSpeed.x = max;
        };

        /**
        * A more compact way of setting the Y velocity range of the emitter.
        *
        * @param Min {number} The minimum value for this range.
        * @param Max {number} The maximum value for this range.
        */
        ArcadeEmitter.prototype.setYSpeed = function (min, max) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 0; }
            this.minParticleSpeed.y = min;
            this.maxParticleSpeed.y = max;
        };

        /**
        * A more compact way of setting the angular velocity constraints of the emitter.
        *
        * @param Min {number} The minimum value for this range.
        * @param Max {number} The maximum value for this range.
        */
        ArcadeEmitter.prototype.setRotation = function (min, max) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 0; }
            this.minRotation = min;
            this.maxRotation = max;
        };

        /**
        * Change the emitter's midpoint to match the midpoint of a <code>Object</code>.
        *
        * @param Object {object} The <code>Object</code> that you want to sync up with.
        */
        ArcadeEmitter.prototype.at = function (object) {
            //this.x = object.body.bounds.halfWidth - (this.width >> 1);
            //this.y = object.body.bounds.halfHeight - (this.height >> 1);
        };
        return ArcadeEmitter;
    })(Phaser.Group);
    Phaser.ArcadeEmitter = ArcadeEmitter;
})(Phaser || (Phaser = {}));
