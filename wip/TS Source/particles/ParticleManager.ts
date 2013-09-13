/// <reference path="../_definitions.ts" />

module Phaser.Particles {

    export class ParticleManager {

        constructor(proParticleCount, integrationType) {

            this.proParticleCount = ParticleUtils.initValue(proParticleCount, ParticleManager.POOL_MAX);
            this.integrationType = ParticleUtils.initValue(integrationType, ParticleManager.EULER);
            this.emitters = [];
            this.renderers = [];
            this.time = 0;
            this.oldTime = 0;

            ParticleManager.pool = new Phaser.Particles.ParticlePool(proParticleCount);
            ParticleManager.integrator = new Phaser.Particles.NumericalIntegration(this.integrationType);

        }

        //the max particle number in pool
        static POOL_MAX = 1000;
        static TIME_STEP = 60;
        //1:100
        static MEASURE = 100;
        static EULER = 'euler';
        static RK2 = 'runge-kutta2';
        static RK4 = 'runge-kutta4';
        static VERLET = 'verlet';

        PARTICLE_CREATED = 'partilcleCreated';
        PARTICLE_UPDATE = 'partilcleUpdate';
        PARTICLE_SLEEP = 'particleSleep';
        PARTICLE_DEAD = 'partilcleDead';
        PROTON_UPDATE = 'protonUpdate';
        PROTON_UPDATE_AFTER = 'protonUpdateAfter';
        EMITTER_ADDED = 'emitterAdded';
        EMITTER_REMOVED = 'emitterRemoved';

        proParticleCount;
        integrationType;
        emitters = [];
        renderers = [];
        time = 0;
        oldTime = 0;
        static pool;
        static integrator;

        amendChangeTabsBug = true;
        TextureBuffer = {};
        TextureCanvasBuffer = {};
        elapsed;

        /**
         * add a type of Renderer
         *
         * @method addRender
         * @param {Renderer} render
         */
        addRender(render) {
            render.proton = this;
            this.renderers.push(render.proton);
        }

        /**
         * add the Emitter
         *
         * @method addEmitter
         * @param {Emitter} emitter
         */
        addEmitter(emitter) {
            this.emitters.push(emitter);
            emitter.parent = this;

            //this.dispatchEvent(new Proton.Event({
            //    type: Proton.EMITTER_ADDED,
            //    emitter: emitter
            //}));
        }

        removeEmitter(emitter) {
            var index = this.emitters.indexOf(emitter);
            this.emitters.splice(index, 1);
            emitter.parent = null;

            //this.dispatchEvent(new Proton.Event({
            //    type: Proton.EMITTER_REMOVED,
            //    emitter: emitter
            //}));
        }

        update() {
            //this.dispatchEvent(new Proton.Event({
            //    type: Proton.PROTON_UPDATE
            //}));

            if (!this.oldTime)
                this.oldTime = new Date().getTime();

            var time = new Date().getTime();
            this.elapsed = (time - this.oldTime) / 1000;
            //if (ParticleUtils.amendChangeTabsBug)
            //    this.amendChangeTabsBugHandler();
            this.oldTime = time;
            if (this.elapsed > 0)
            {
                for (var i = 0; i < this.emitters.length; i++)
                {
                    this.emitters[i].update(this.elapsed);
                }
            }

            //this.dispatchEvent(new Proton.Event({
            //    type: Proton.PROTON_UPDATE_AFTER
            //}));
        }

        amendChangeTabsBugHandler() {

            if (this.elapsed > .5)
            {
                this.oldTime = new Date().getTime();
                this.elapsed = 0;
            }
        }

        getParticleNumber() {
            var total = 0;
            for (var i = 0; i < this.emitters.length; i++)
            {
                total += this.emitters[i].particles.length;
            }
            return total;
        }

        destroy() {
            for (var i = 0; i < this.emitters.length; i++)
            {
                this.emitters[i].destory();
                delete this.emitters[i];
            }

            this.emitters = [];
            this.time = 0;
            this.oldTime = 0;
            ParticleManager.pool.release();
        }

    }

}
