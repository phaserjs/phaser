/// <reference path="../Game.ts" />
/// <reference path="Particle.ts" />
/// <reference path="../geom/Vector2.ts" />

/**
* Phaser - AngleConstraint
*
* constrains 3 particles to an angle
*/

module Phaser.Verlet {

    export class AngleConstraint {

        /**
        * Creates a new AngleConstraint object.
        * @class AngleConstraint
        * @constructor
        * @param {Number} x The x coordinate of vector2
        * @param {Number} y The y coordinate of vector2
        * @return {AngleConstraint} This object
        **/
        constructor(a: Phaser.Verlet.Particle, b: Phaser.Verlet.Particle, c: Phaser.Verlet.Particle, stiffness: number) {

            this.a = a;
            this.b = b;
            this.c = c;
            this.angle = this.b.pos.angle2(this.a.pos, this.c.pos);
            this.stiffness = stiffness;

        }

        public a: Phaser.Verlet.Particle;
        public b: Phaser.Verlet.Particle;
        public c: Phaser.Verlet.Particle;
        public angle: number;
        public stiffness: number;

        public relax(stepCoef: number) {

            var angle = this.b.pos.angle2(this.a.pos, this.c.pos);
            var diff = angle - this.angle;

            if (diff <= -Math.PI)
                diff += 2 * Math.PI;
            else if (diff >= Math.PI)
                diff -= 2 * Math.PI;

            diff *= stepCoef * this.stiffness;

            this.a.pos = this.a.pos.rotate(this.b.pos, diff);
            this.c.pos = this.c.pos.rotate(this.b.pos, -diff);
            this.b.pos = this.b.pos.rotate(this.a.pos, diff);
            this.b.pos = this.b.pos.rotate(this.c.pos, -diff);

        }

        public render(ctx) {

            ctx.beginPath();
            ctx.moveTo(this.a.pos.x, this.a.pos.y);
            ctx.lineTo(this.b.pos.x, this.b.pos.y);
            ctx.lineTo(this.c.pos.x, this.c.pos.y);
            var tmp = ctx.lineWidth;
            ctx.lineWidth = 5;
            ctx.strokeStyle = "rgba(255,255,0,0.2)";
            ctx.stroke();
            ctx.lineWidth = tmp;

        }

    }

}