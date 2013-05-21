/// <reference path="../Game.ts" />
/// <reference path="../geom/Vector2.ts" />

/**
* Phaser - Verlet - Particle
*
* 
*/

module Phaser.Verlet {

    export class Particle {

        /**
        * Creates a new Particle object.
        * @class Particle
        * @constructor
        * @param {Number} x The x coordinate of vector2
        * @param {Number} y The y coordinate of vector2
        * @return {Particle} This object
        **/
        constructor(pos: Vector2) {

            this.pos = (new Vector2()).mutableSet(pos);
            this.lastPos = (new Vector2()).mutableSet(pos);
            

        }

        public pos: Vector2;
        public lastPos: Vector2;

        public render(ctx) {

	        ctx.beginPath();
	        ctx.arc(this.pos.x, this.pos.y, 2, 0, 2*Math.PI);
	        ctx.fillStyle = "#2dad8f";
	        ctx.fill();

        }

    }

}
