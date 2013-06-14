/// <reference path="../../math/Vec2.ts" />
/// <reference path="../../math/Vec2Utils.ts" />
/// <reference path="Manager.ts" />
/// <reference path="Body.ts" />
/// <reference path="shapes/Shape.ts" />

/**
* Phaser - Advanced Physics - Contact
*
* Based on the work Ju Hyung Lee started in JS PhyRus.
*/

module Phaser.Physics.Advanced {

    export class Contact {

        constructor(p, n, d, hash) {

            this.hash = hash;
            this.point = p;
            this.normal = n;
            this.depth = d;
            this.lambdaNormal = 0;
            this.lambdaTangential = 0;

            this.r1 = new Phaser.Vec2;
            this.r2 = new Phaser.Vec2;
            this.r1_local = new Phaser.Vec2;
            this.r2_local = new Phaser.Vec2;

        }

        public hash;

        // Linear velocities at contact point
        public r1: Phaser.Vec2;
        public r2: Phaser.Vec2;
        public r1_local: Phaser.Vec2;
        public r2_local: Phaser.Vec2;
        // Bounce velocity
        public bounce: number;
        public emn: number;
        public emt: number;

        // Contact point
        public point;

        // Contact normal (toward shape2)
        public normal: Phaser.Vec2;

        // Penetration depth (d < 0)
        public depth;

        // Accumulated normal constraint impulse
        public lambdaNormal;

        // Accumulated tangential constraint impulse
        public lambdaTangential;

    }

}
