var Phaser;
(function (Phaser) {
    (function (Particles) {
        /// <reference path="../../_definitions.ts" />
        (function (Behaviours) {
            var Behaviour = (function () {
                function Behaviour(life, easing) {
                    /**
                    * The behaviour's id;
                    * @property id
                    * @type {String} id
                    */
                    this.id = 'Behaviour_' + Behaviour.ID++;
                    this.life = Particles.ParticleUtils.initValue(life, Infinity);
                    /**
                    * The behaviour's decaying trend, for example Proton.easeOutQuart;
                    * @property easing
                    * @type {String}
                    * @default Proton.easeLinear
                    */
                    this.easing = Particles.ParticleUtils.setEasingByName(easing);
                    this.age = 0;
                    this.energy = 1;
                    /**
                    * The behaviour is Dead;
                    * @property dead
                    * @type {bool}
                    */
                    this.dead = false;
                    /**
                    * The behaviour's parents array;
                    * @property parents
                    * @type {Array}
                    */
                    this.parents = [];
                    /**
                    * The behaviour name;
                    * @property name
                    * @type {string}
                    */
                    this.name = 'Behaviour';
                }
                Behaviour.prototype.normalizeForce = /**
                * Reset this behaviour's parameters
                *
                * @method reset
                * @param {Number} this behaviour's life
                * @param {String} this behaviour's easing
                */
                //reset (life, easing) {
                //    this.life = ParticleUtils.initValue(life, Infinity);
                //    //this.easing = ParticleUtils.initValue(easing, Proton.ease.setEasingByName(Proton.easeLinear));
                //}
                /**
                * Normalize a force by 1:100;
                *
                * @method normalizeForce
                * @param {Proton.Vector2D} force
                */
                function (force) {
                    return force.multiplyScalar(Particles.ParticleManager.MEASURE);
                };
                Behaviour.prototype.normalizeValue = /**
                * Normalize a value by 1:100;
                *
                * @method normalizeValue
                * @param {Number} value
                */
                function (value) {
                    return value * Particles.ParticleManager.MEASURE;
                };
                Behaviour.prototype.initialize = /**
                * Initialize the behaviour's parameters for all particles
                *
                * @method initialize
                * @param {Proton.Particle} particle
                */
                function (particle) {
                };
                Behaviour.prototype.applyBehaviour = /**
                * Apply this behaviour for all particles every time
                *
                * @method applyBehaviour
                * @param {Proton.Particle} particle
                * @param {Number} the integrate time 1/ms
                * @param {Int} the particle index
                */
                function (particle, time, index) {
                    this.age += time;
                    if(this.age >= this.life || this.dead) {
                        this.energy = 0;
                        this.dead = true;
                        this.destroy();
                    } else {
                        var scale = this.easing(particle.age / particle.life);
                        this.energy = Math.max(1 - scale, 0);
                    }
                };
                Behaviour.prototype.destroy = /**
                * Destory this behaviour
                * @method destory
                */
                function () {
                    var index;
                    var length = this.parents.length, i;
                    for(i = 0; i < length; i++) {
                        this.parents[i].removeBehaviour(this);
                    }
                    this.parents = [];
                };
                return Behaviour;
            })();
            Behaviours.Behaviour = Behaviour;            
        })(Particles.Behaviours || (Particles.Behaviours = {}));
        var Behaviours = Particles.Behaviours;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
