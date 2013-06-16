/// <reference path="../../../math/Vec2.ts" />
/// <reference path="../Manager.ts" />
/// <reference path="../Body.ts" />
/// <reference path="Shape.ts" />
/// <reference path="Poly.ts" />

/**
* Phaser - Advanced Physics - Shapes - Triangle
*
* Based on the work Ju Hyung Lee started in JS PhyRus.
*/

module Phaser.Physics.Advanced.Shapes {

    export class Triangle extends Phaser.Physics.Advanced.Shapes.Poly {

        constructor(p1, p2, p3) {

            super( [ new Phaser.Vec2(p1.x, p1.y), new Phaser.Vec2(p2.x, p2.y), new Phaser.Vec2(p3.x, p3.y) ] );

        }

    }

}
