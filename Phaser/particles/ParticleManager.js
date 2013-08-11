var Phaser;
(function (Phaser) {
    /// <reference path="../_definitions.ts" />
    (function (Particles) {
        var ParticleManager = (function () {
            function ParticleManager(proParticleCount, integrationType) {
                this.PARTICLE_CREATED = 'partilcleCreated';
                this.PARTICLE_UPDATE = 'partilcleUpdate';
                this.PARTICLE_SLEEP = 'particleSleep';
                this.PARTICLE_DEAD = 'partilcleDead';
                this.PROTON_UPDATE = 'protonUpdate';
                this.PROTON_UPDATE_AFTER = 'protonUpdateAfter';
                this.EMITTER_ADDED = 'emitterAdded';
                this.EMITTER_REMOVED = 'emitterRemoved';
                this.emitters = [];
                this.renderers = [];
                this.time = 0;
                this.oldTime = 0;
                this.amendChangeTabsBug = true;
                this.TextureBuffer = {};
                this.TextureCanvasBuffer = {};
                this.proParticleCount = Particles.ParticleUtils.initValue(proParticleCount, ParticleManager.POOL_MAX);
                this.integrationType = Particles.ParticleUtils.initValue(integrationType, ParticleManager.EULER);
                this.emitters = [];
                this.renderers = [];
                this.time = 0;
                this.oldTime = 0;

                ParticleManager.pool = new Phaser.Particles.ParticlePool(proParticleCount);
                ParticleManager.integrator = new Phaser.Particles.NumericalIntegration(this.integrationType);
            }
            /**
            * add a type of Renderer
            *
            * @method addRender
            * @param {Renderer} render
            */
            ParticleManager.prototype.addRender = function (render) {
                render.proton = this;
                this.renderers.push(render.proton);
            };

            /**
            * add the Emitter
            *
            * @method addEmitter
            * @param {Emitter} emitter
            */
            ParticleManager.prototype.addEmitter = function (emitter) {
                this.emitters.push(emitter);
                emitter.parent = this;
                //this.dispatchEvent(new Proton.Event({
                //    type: Proton.EMITTER_ADDED,
                //    emitter: emitter
                //}));
            };

            ParticleManager.prototype.removeEmitter = function (emitter) {
                var index = this.emitters.indexOf(emitter);
                this.emitters.splice(index, 1);
                emitter.parent = null;
                //this.dispatchEvent(new Proton.Event({
                //    type: Proton.EMITTER_REMOVED,
                //    emitter: emitter
                //}));
            };

            ParticleManager.prototype.update = function () {
                if (!this.oldTime)
                    this.oldTime = new Date().getTime();

                var time = new Date().getTime();
                this.elapsed = (time - this.oldTime) / 1000;

                //if (ParticleUtils.amendChangeTabsBug)
                //    this.amendChangeTabsBugHandler();
                this.oldTime = time;
                if (this.elapsed > 0) {
                    for (var i = 0; i < this.emitters.length; i++) {
                        this.emitters[i].update(this.elapsed);
                    }
                }
                //this.dispatchEvent(new Proton.Event({
                //    type: Proton.PROTON_UPDATE_AFTER
                //}));
            };

            ParticleManager.prototype.amendChangeTabsBugHandler = function () {
                if (this.elapsed > .5) {
                    this.oldTime = new Date().getTime();
                    this.elapsed = 0;
                }
            };

            ParticleManager.prototype.getParticleNumber = function () {
                var total = 0;
                for (var i = 0; i < this.emitters.length; i++) {
                    total += this.emitters[i].particles.length;
                }
                return total;
            };

            ParticleManager.prototype.destroy = function () {
                for (var i = 0; i < this.emitters.length; i++) {
                    this.emitters[i].destory();
                    delete this.emitters[i];
                }

                this.emitters = [];
                this.time = 0;
                this.oldTime = 0;
                ParticleManager.pool.release();
            };
            ParticleManager.POOL_MAX = 1000;
            ParticleManager.TIME_STEP = 60;

            ParticleManager.MEASURE = 100;
            ParticleManager.EULER = 'euler';
            ParticleManager.RK2 = 'runge-kutta2';
            ParticleManager.RK4 = 'runge-kutta4';
            ParticleManager.VERLET = 'verlet';
            return ParticleManager;
        })();
        Particles.ParticleManager = ParticleManager;
    })(Phaser.Particles || (Phaser.Particles = {}));
    var Particles = Phaser.Particles;
})(Phaser || (Phaser = {}));
