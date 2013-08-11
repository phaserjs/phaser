/// <reference path="../_definitions.ts" />

module Phaser.Particles {

    export class Particle {

        /**
         * the Particle class
         *
         * @class Proton.Particle
         * @constructor
         * @param {Object} pObj the parameters object;
         * for example {life:3,dead:false}
         */
        constructor() {
            /**
             * The particle's id;
             * @property id
             * @type {String} id
             */
            this.id = 'particle_' + Particle.ID++;
            this.reset(true);
        }

        static ID = 0;

        id;
        life = Infinity;
        age = 0;
        energy = 1;
        dead = false;
        sleep = false;
        target = null;
        sprite = null;
        parent = null;
        mass = 1;
        radius = 10;
        alpha = 1;
        scale = 1;
        rotation = 0;
        color = null;
        easing = Phaser.Easing.Linear.None;
        transform;
        p = new Phaser.Vec2();
        v = new Phaser.Vec2();
        a = new Phaser.Vec2();
        old = {
            p: new Phaser.Vec2(),
            v: new Phaser.Vec2(),
            a: new Phaser.Vec2()
        };
        behaviours = [];

        getDirection() {
            return Math.atan2(this.v.x, -this.v.y) * (180 / Math.PI);
        }

        reset(init) {
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
            if (init)
            {
                this.transform = {}
				this.p = new Phaser.Vec2();
                this.v = new Phaser.Vec2();
                this.a = new Phaser.Vec2();
                this.old = {
                    p: new Phaser.Vec2(),
                    v: new Phaser.Vec2(),
                    a: new Phaser.Vec2()
                };
                this.behaviours = [];
            } else
            {
                ParticleUtils.destroyObject(this.transform);
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
            }
			return this;
        }

        update(time, index) {
            if (!this.sleep)
            {
                this.age += time;
                var length = this.behaviours.length, i;
                for (i = 0; i < length; i++)
                {
                    if (this.behaviours[i])
                        this.behaviours[i].applyBehaviour(this, time, index)
				}
            }

            if (this.age >= this.life)
            {
                this.destroy();
            } else
            {
                var scale = this.easing(this.age / this.life);
                this.energy = Math.max(1 - scale, 0);
            }

        }

        addBehaviour(behaviour) {
            this.behaviours.push(behaviour);
            if (behaviour.hasOwnProperty('parents'))
                behaviour.parents.push(this);
            behaviour.initialize(this);
        }

        addBehaviours(behaviours) {
            var length = behaviours.length, i;
            for (i = 0; i < length; i++)
            {
                this.addBehaviour(behaviours[i]);
            }
        }

        removeBehaviour(behaviour) {
            var index = this.behaviours.indexOf(behaviour);
            if (index > -1)
            {
                var behaviour = this.behaviours.splice(index, 1);
                behaviour.parents = null;
            }
        }

        removeAllBehaviours() {
            ParticleUtils.destroyArray(this.behaviours);
        }

        /**
         * Destory this particle
         * @method destory
         */
        destroy() {
            this.removeAllBehaviours();
            this.energy = 0;
            this.dead = true;
            this.parent = null;
        }


    }

}