/// <reference path="../Game.ts" />
/// <reference path="Particle.ts" />
/// <reference path="../geom/Vector2.ts" />

/**
* Phaser - PinConstraint
*
* Constrains to static / fixed point
*/

module Phaser.Verlet {

    export class PinConstraint {

        /**
        * Creates a new PinConstraint object.
        * @class PinConstraint
        * @constructor
        * @param {Number} x The x coordinate of vector2
        * @param {Number} y The y coordinate of vector2
        * @return {PinConstraint} This object
        **/
        constructor(a: Phaser.Verlet.Particle, pos: Vector2) {

            this.a = a;
            this.pos = (new Vector2()).mutableSet(pos);

        }

        public a: Phaser.Verlet.Particle;
        public pos: Vector2;

        public relax() {
            this.a.pos.mutableSet(this.pos);
        }

        public render(ctx) {

            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, 6, 0, 2*Math.PI);
            ctx.fillStyle = "rgba(0,153,255,0.1)";
            ctx.fill();

        }

    }

}