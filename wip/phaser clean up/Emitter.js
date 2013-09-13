var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Phaser;
(function (Phaser) {
    var Emitter = (function (_super) {
        __extends(Emitter, _super);
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
        Emitter.prototype.destroy = function () {
            this.minParticleSpeed = null;
            this.maxParticleSpeed = null;
            this.particleDrag = null;
            this.particleClass = null;
            this._point = null;
            _super.prototype.destroy.call(this);
        };
        Emitter.prototype.makeParticles = function (graphics, quantity, multiple, collide) {
            if (typeof quantity === "undefined") { quantity = 50; }
            if (typeof multiple === "undefined") { multiple = false; }
            if (typeof collide === "undefined") { collide = 0; }
            this.maxSize = quantity;
            var totalFrames = 1;
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
                } else {
                    if(graphics) {
                        particle.loadGraphic(graphics);
                    }
                }
                if(collide > 0) {
                    particle.allowCollisions = Phaser.Collision.ANY;
                    particle.width *= collide;
                    particle.height *= collide;
                } else {
                    particle.allowCollisions = Phaser.Collision.NONE;
                }
                particle.exists = false;
                this.add(particle);
                i++;
            }
            return this;
        };
        Emitter.prototype.update = function () {
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
        Emitter.prototype.kill = function () {
            this.on = false;
            _super.prototype.kill.call(this);
        };
        Emitter.prototype.start = function (explode, lifespan, frequency, quantity) {
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
        Emitter.prototype.emitParticle = function () {
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
        Emitter.prototype.setSize = function (width, height) {
            this.width = width;
            this.height = height;
        };
        Emitter.prototype.setXSpeed = function (min, max) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 0; }
            this.minParticleSpeed.x = min;
            this.maxParticleSpeed.x = max;
        };
        Emitter.prototype.setYSpeed = function (min, max) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 0; }
            this.minParticleSpeed.y = min;
            this.maxParticleSpeed.y = max;
        };
        Emitter.prototype.setRotation = function (min, max) {
            if (typeof min === "undefined") { min = 0; }
            if (typeof max === "undefined") { max = 0; }
            this.minRotation = min;
            this.maxRotation = max;
        };
        Emitter.prototype.at = function (object) {
            object.getMidpoint(this._point);
            this.x = this._point.x - (this.width >> 1);
            this.y = this._point.y - (this.height >> 1);
        };
        return Emitter;
    })(Phaser.Group);
    Phaser.Emitter = Emitter;    
})(Phaser || (Phaser = {}));
