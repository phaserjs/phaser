/// <reference path="../Game.ts" />
/// <reference path="../geom/Vector2.ts" />
/// <reference path="Particle.ts" />
/// <reference path="PinConstraint.ts" />

/**
* Phaser - Verlet - Composite
*
* 
*/

module Phaser.Verlet {

    export class Composite {

        /**
        * Creates a new Composite object.
        * @class Composite
        * @constructor
        * @param {Number} x The x coordinate of vector2
        * @param {Number} y The y coordinate of vector2
        * @return {Composite} This object
        **/
        constructor(game: Game) {

            this._game = game;

            this.particles = [];
            this.constraints = [];

        }

        private _game: Game;

        public particles: Phaser.Verlet.Particle[];
        public constraints;
        public drawParticles = null;
        public drawConstraints = null;

        //  Map sprites to particles

        public createDistanceConstraint(a: Phaser.Verlet.Particle, b: Phaser.Verlet.Particle, stiffness: number, distance?: number = null): Phaser.Verlet.DistanceConstraint {

            this.constraints.push(new Phaser.Verlet.DistanceConstraint(a, b, stiffness, distance));
            return this.constraints[this.constraints.length - 1];

        }

        public createAngleConstraint(a: Phaser.Verlet.Particle, b: Phaser.Verlet.Particle, c: Phaser.Verlet.Particle, stiffness: number): Phaser.Verlet.AngleConstraint {

            this.constraints.push(new Phaser.Verlet.AngleConstraint(a, b, c, stiffness));
            return this.constraints[this.constraints.length - 1];

        }

        public createPinConstraint(a: Phaser.Verlet.Particle, pos: Vector2): Phaser.Verlet.PinConstraint {

            this.constraints.push(new Phaser.Verlet.PinConstraint(a, pos));
            return this.constraints[this.constraints.length - 1];

        }

        public pin(index, pos?=null) {

            if (pos == null)
            {
                pos = this.particles[index].pos;
            }

            var pc = new Phaser.Verlet.PinConstraint(this.particles[index], pos);
            this.constraints.push(pc);
            return pc;

        }

    }

}
