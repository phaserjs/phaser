/// <reference path="../../math/Vec2.ts" />
/// <reference path="../../math/Vec2Utils.ts" />
/// <reference path="Manager.ts" />
/// <reference path="Body.ts" />

/**
* Phaser - Advanced Physics - Plane
*
* Based on the work Ju Hyung Lee started in JS PhyRus.
*/

module Phaser.Physics.Advanced {

    export class Plane {

        constructor(normal: Phaser.Vec2, d: number) {

            this.normal = normal;
            this.d = d;

        }

        public normal: Phaser.Vec2;
        public d: number;

    }

}
