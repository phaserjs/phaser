/// <reference path="../Game.ts" />
/// <reference path="Particle.ts" />
/// <reference path="../geom/Vector2.ts" />

/**
* Phaser - DistanceConstraint
*
* Constrains to initial distance
*/

module Phaser.Verlet {

    export class DistanceConstraint {

        /**
        * Creates a new DistanceConstraint object.
        * @class DistanceConstraint
        * @constructor
        * @param {Number} x The x coordinate of vector2
        * @param {Number} y The y coordinate of vector2
        * @return {DistanceConstraint} This object
        **/
        constructor(a: Phaser.Verlet.Particle, b: Phaser.Verlet.Particle, stiffness: number, distance?:number = null) {

            this.a = a;
            this.b = b;

            if (distance === null)
            {
                this.distance = a.pos.sub(b.pos).length();
            }
            else
            {
                this.distance = distance;
            }

            this.stiffness = stiffness;

        }

        public a: Phaser.Verlet.Particle;
        public b: Phaser.Verlet.Particle;
        public distance: number;
        public stiffness: number;

        public relax(stepCoef: number) {

            var normal = this.a.pos.sub(this.b.pos);

            var m = normal.length2();

            normal.mutableScale(((this.distance * this.distance - m) / m) * this.stiffness * stepCoef);

            this.a.pos.mutableAdd(normal);
            this.b.pos.mutableSub(normal);

        }

        public render(ctx) {
	        ctx.beginPath();
	        ctx.moveTo(this.a.pos.x, this.a.pos.y);
	        ctx.lineTo(this.b.pos.x, this.b.pos.y);
	        ctx.strokeStyle = "#d8dde2";
	        ctx.stroke();
	        ctx.closePath();
        }

    }

}