var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    (function (Particles) {
        var Emitter = (function () {
            /**
            * You can use this emit particles.
            *
            * It will dispatch follow events:
            * Proton.PARTICLE_CREATED
            * Proton.PARTICLE_UPDATA
            * Proton.PARTICLE_DEAD
            *
            * @class Proton.Emitter
            * @constructor
            * @param {Object} pObj the parameters object;
            * for example {damping:0.01,bindEmitter:false}
            */
            function Emitter(pObj) {
                this.initializes = [];
                this.particles = [];
                this.behaviours = [];
                this.emitTime = 0;
                this.emitTotalTimes = -1;
                this.initializes = [];
                this.particles = [];
                this.behaviours = [];
                this.emitTime = 0;
                this.emitTotalTimes = -1;
                /**
                * The friction coefficient for all particle emit by This;
                * @property damping
                * @type {Number}
                * @default 0.006
                */
                this.damping = .006;
                /**
                * If bindEmitter the particles can bind this emitter's property;
                * @property bindEmitter
                * @type {bool}
                * @default true
                */
                this.bindEmitter = true;
                /**
                * The number of particles per second emit (a [particle]/b [s]);
                * @property rate
                * @type {Proton.Rate}
                * @default Proton.Rate(1, .1)
                */
                this.rate = new Phaser.Particles.Initializers.Rate(1, .1);
                //Emitter._super_.call(this, pObj);
                /**
                * The emitter's id;
                * @property id
                * @type {String} id
                */
                this.id = 'emitter_' + Emitter.ID++;
            }
            Emitter.ID = 0;
            Emitter.prototype.emit = /**
            * start emit particle
            * @method emit
            * @param {Number} emitTime begin emit time;
            * @param {String} life the life of this emitter
            */
            function (emitTime, life) {
                this.emitTime = 0;
                this.emitTotalTimes = Particles.ParticleUtils.initValue(emitTime, Infinity);
                if(life == true || life == 'life' || life == 'destroy') {
                    if(emitTime == 'once') {
                        this.life = 1;
                    } else {
                        this.life = this.emitTotalTimes;
                    }
                } else if(!isNaN(life)) {
                    this.life = life;
                }
                this.rate.init();
            };
            Emitter.prototype.stopEmit = /**
            * stop emiting
            * @method stopEmit
            */
            function () {
                this.emitTotalTimes = -1;
                this.emitTime = 0;
            };
            Emitter.prototype.removeAllParticles = /**
            * remove current all particles
            * @method removeAllParticles
            */
            function () {
                for(var i = 0; i < this.particles.length; i++) {
                    this.particles[i].dead = true;
                }
            };
            Emitter.prototype.createParticle = /**
            * create single particle;
            *
            * can use emit({x:10},new Gravity(10),{'particleUpdate',fun}) or emit([{x:10},new Initialize],new Gravity(10),{'particleUpdate',fun})
            * @method removeAllParticles
            */
            function (initialize, behaviour) {
                if (typeof initialize === "undefined") { initialize = null; }
                if (typeof behaviour === "undefined") { behaviour = null; }
                var particle = Particles.ParticleManager.pool.get();
                this.setupParticle(particle, initialize, behaviour);
                //this.dispatchEvent(new Proton.Event({
                //    type: Proton.PARTICLE_CREATED,
                //    particle: particle
                //}));
                return particle;
            };
            Emitter.prototype.addSelfInitialize = /**
            * add initialize to this emitter
            * @method addSelfInitialize
            */
            function (pObj) {
                if(pObj['init']) {
                    pObj.init(this);
                } else {
                    //this.initAll();
                                    }
            };
            Emitter.prototype.addInitialize = /**
            * add the Initialize to particles;
            *
            * you can use initializes array:for example emitter.addInitialize(initialize1,initialize2,initialize3);
            * @method addInitialize
            * @param {Proton.Initialize} initialize like this new Proton.Radius(1, 12)
            */
            function () {
                var length = arguments.length, i;
                for(i = 0; i < length; i++) {
                    this.initializes.push(arguments[i]);
                }
            };
            Emitter.prototype.removeInitialize = /**
            * remove the Initialize
            * @method removeInitialize
            * @param {Proton.Initialize} initialize a initialize
            */
            function (initializer) {
                var index = this.initializes.indexOf(initializer);
                if(index > -1) {
                    this.initializes.splice(index, 1);
                }
            };
            Emitter.prototype.removeInitializers = /**
            * remove all Initializes
            * @method removeInitializers
            */
            function () {
                Particles.ParticleUtils.destroyArray(this.initializes);
            };
            Emitter.prototype.addBehaviour = /**
            * add the Behaviour to particles;
            *
            * you can use Behaviours array:emitter.addBehaviour(Behaviour1,Behaviour2,Behaviour3);
            * @method addBehaviour
            * @param {Proton.Behaviour} behaviour like this new Proton.Color('random')
            */
            function () {
                var length = arguments.length, i;
                for(i = 0; i < length; i++) {
                    this.behaviours.push(arguments[i]);
                    if(arguments[i].hasOwnProperty("parents")) {
                        arguments[i].parents.push(this);
                    }
                }
            };
            Emitter.prototype.removeBehaviour = /**
            * remove the Behaviour
            * @method removeBehaviour
            * @param {Proton.Behaviour} behaviour a behaviour
            */
            function (behaviour) {
                var index = this.behaviours.indexOf(behaviour);
                if(index > -1) {
                    this.behaviours.splice(index, 1);
                }
            };
            Emitter.prototype.removeAllBehaviours = /**
            * remove all behaviours
            * @method removeAllBehaviours
            */
            function () {
                Particles.ParticleUtils.destroyArray(this.behaviours);
            };
            Emitter.prototype.integrate = function (time) {
                var damping = 1 - this.damping;
                Particles.ParticleManager.integrator.integrate(this, time, damping);
                var length = this.particles.length, i;
                for(i = 0; i < length; i++) {
                    var particle = this.particles[i];
                    particle.update(time, i);
                    Particles.ParticleManager.integrator.integrate(particle, time, damping);
                    //this.dispatchEvent(new Proton.Event({
                    //    type: Proton.PARTICLE_UPDATE,
                    //    particle: particle
                    //}));
                                    }
            };
            Emitter.prototype.emitting = function (time) {
                if(this.emitTotalTimes == 1) {
                    var length = this.rate.getValue(99999), i;
                    for(i = 0; i < length; i++) {
                        this.createParticle();
                    }
                    this.emitTotalTimes = 0;
                } else if(!isNaN(this.emitTotalTimes)) {
                    this.emitTime += time;
                    if(this.emitTime < this.emitTotalTimes) {
                        var length = this.rate.getValue(time), i;
                        for(i = 0; i < length; i++) {
                            this.createParticle();
                        }
                    }
                }
            };
            Emitter.prototype.update = function (time) {
                this.age += time;
                if(this.age >= this.life || this.dead) {
                    this.destroy();
                }
                this.emitting(time);
                this.integrate(time);
                var particle;
                var length = this.particles.length, k;
                for(k = length - 1; k >= 0; k--) {
                    particle = this.particles[k];
                    if(particle.dead) {
                        Particles.ParticleManager.pool.set(particle);
                        this.particles.splice(k, 1);
                        //this.dispatchEvent(new Proton.Event({
                        //    type: Proton.PARTICLE_DEAD,
                        //    particle: particle
                        //}));
                                            }
                }
            };
            Emitter.prototype.setupParticle = function (particle, initialize, behaviour) {
                var initializes = this.initializes;
                var behaviours = this.behaviours;
                if(initialize) {
                    if(initialize instanceof Array) {
                        initializes = initialize;
                    } else {
                        initializes = [
                            initialize
                        ];
                    }
                }
                if(behaviour) {
                    if(behaviour instanceof Array) {
                        behaviours = behaviour;
                    } else {
                        behaviours = [
                            behaviour
                        ];
                    }
                }
                //Proton.InitializeUtil.initialize(this, particle, initializes);
                particle.addBehaviours(behaviours);
                particle.parent = this;
                this.particles.push(particle);
            };
            Emitter.prototype.destroy = /**
            * Destory this Emitter
            * @method destory
            */
            function () {
                this.dead = true;
                this.emitTotalTimes = -1;
                if(this.particles.length == 0) {
                    this.removeInitializers();
                    this.removeAllBehaviours();
                    if(this.parent) {
                        this.parent.removeEmitter(this);
                    }
                }
            };
            return Emitter;
        })();
        Particles.Emitter = Emitter;        
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
