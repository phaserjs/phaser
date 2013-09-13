var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    (function (Particles) {
        var Particle = (function () {
            /**
            * the Particle class
            *
            * @class Proton.Particle
            * @constructor
            * @param {Object} pObj the parameters object;
            * for example {life:3,dead:false}
            */
            function Particle() {
                this.life = Infinity;
                this.age = 0;
                this.energy = 1;
                this.dead = false;
                this.sleep = false;
                this.target = null;
                this.sprite = null;
                this.parent = null;
                this.mass = 1;
                this.radius = 10;
                this.alpha = 1;
                this.scale = 1;
                this.rotation = 0;
                this.color = null;
                this.easing = Phaser.Easing.Linear.None;
                this.p = new Phaser.Vec2();
                this.v = new Phaser.Vec2();
                this.a = new Phaser.Vec2();
                this.old = {
                    p: new Phaser.Vec2(),
                    v: new Phaser.Vec2(),
                    a: new Phaser.Vec2()
                };
                this.behaviours = [];
                /**
                * The particle's id;
                * @property id
                * @type {String} id
                */
                this.id = 'particle_' + Particle.ID++;
                this.reset(true);
            }
            Particle.ID = 0;
            Particle.prototype.getDirection = function () {
                return Math.atan2(this.v.x, -this.v.y) * (180 / Math.PI);
            };
            Particle.prototype.reset = function (init) {
                this.life = Infinity;
                this.age = 0;
                this.energy = 1;
                this.dead = false;
                this.sleep = false;
                this.target = null;
                this.sprite = null;
                this.parent = null;
                this.mass = 1;
                this.radius = 10;
                this.alpha = 1;
                this.scale = 1;
                this.rotation = 0;
                this.color = null;
                this.easing = Phaser.Easing.Linear.None;
                if(init) {
                    this.transform = {
                    };
                    this.p = new Phaser.Vec2();
                    this.v = new Phaser.Vec2();
                    this.a = new Phaser.Vec2();
                    this.old = {
                        p: new Phaser.Vec2(),
                        v: new Phaser.Vec2(),
                        a: new Phaser.Vec2()
                    };
                    this.behaviours = [];
                } else {
                    Particles.ParticleUtils.destroyObject(this.transform);
                    this.p.setTo(0, 0);
                    this.v.setTo(0, 0);
                    this.a.setTo(0, 0);
                    this.old.p.setTo(0, 0);
                    this.old.v.setTo(0, 0);
                    this.old.a.setTo(0, 0);
                    this.removeAllBehaviours();
                }
                this.transform.rgb = {
                    r: 255,
                    g: 255,
                    b: 255
                };
                return this;
            };
            Particle.prototype.update = function (time, index) {
                if(!this.sleep) {
                    this.age += time;
                    var length = this.behaviours.length, i;
                    for(i = 0; i < length; i++) {
                        if(this.behaviours[i]) {
                            this.behaviours[i].applyBehaviour(this, time, index);
                        }
                    }
                }
                if(this.age >= this.life) {
                    this.destroy();
                } else {
                    var scale = this.easing(this.age / this.life);
                    this.energy = Math.max(1 - scale, 0);
                }
            };
            Particle.prototype.addBehaviour = function (behaviour) {
                this.behaviours.push(behaviour);
                if(behaviour.hasOwnProperty('parents')) {
                    behaviour.parents.push(this);
                }
                behaviour.initialize(this);
            };
            Particle.prototype.addBehaviours = function (behaviours) {
                var length = behaviours.length, i;
                for(i = 0; i < length; i++) {
                    this.addBehaviour(behaviours[i]);
                }
            };
            Particle.prototype.removeBehaviour = function (behaviour) {
                var index = this.behaviours.indexOf(behaviour);
                if(index > -1) {
                    var outBehaviour = this.behaviours.splice(index, 1);
                    //outBehaviour.parents = null;
                                    }
            };
            Particle.prototype.removeAllBehaviours = function () {
                Particles.ParticleUtils.destroyArray(this.behaviours);
            };
            Particle.prototype.destroy = /**
            * Destory this particle
            * @method destory
            */
            function () {
                this.removeAllBehaviours();
                this.energy = 0;
                this.dead = true;
                this.parent = null;
            };
            return Particle;
        })();
        Particles.Particle = Particle;        
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
