/// <reference path="../../_definitions.ts" />

module Phaser.Particles.Behaviours {

    export class Behaviour {

        constructor(life, easing) {
            /**
             * The behaviour's id;
             * @property id
             * @type {String} id
             */
            this.id = 'Behaviour_' + Behaviour.ID++;
            this.life = ParticleUtils.initValue(life, Infinity);
            /**
             * The behaviour's decaying trend, for example Proton.easeOutQuart;
             * @property easing
             * @type {String}
             * @default Proton.easeLinear
             */
            this.easing = ParticleUtils.setEasingByName(easing);
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

        static ID;
        id;
        life;
        easing;
        age;
        energy;
        dead;
        parents;
        name;

        /**
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
		normalizeForce (force) {
            return force.multiplyScalar(ParticleManager.MEASURE);
		}

		/**
		 * Normalize a value by 1:100;
		 *
		 * @method normalizeValue
		 * @param {Number} value
		 */
		normalizeValue (value) {
            return value * ParticleManager.MEASURE;
		}

		/**
		 * Initialize the behaviour's parameters for all particles
		 *
		 * @method initialize
		 * @param {Proton.Particle} particle
		 */
		initialize (particle) {
		}

		/**
		 * Apply this behaviour for all particles every time
		 *
		 * @method applyBehaviour
		 * @param {Proton.Particle} particle
		 * @param {Number} the integrate time 1/ms
		 * @param {Int} the particle index
		 */
		applyBehaviour (particle, time, index) {

            this.age += time;

            if (this.age >= this.life || this.dead)
            {
                this.energy = 0;
                this.dead = true;
                this.destroy();
            }
            else
            {
                var scale = this.easing(particle.age / particle.life);
                this.energy = Math.max(1 - scale, 0);
            }

		}

		/**
		 * Destory this behaviour
		 * @method destory
		 */
		destroy () {

            var index;
            var length = this.parents.length, i;

            for (i = 0; i < length; i++)
            {
                this.parents[i].removeBehaviour(this);
            }

            this.parents = [];
        }

    }

}