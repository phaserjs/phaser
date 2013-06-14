/// <reference path="../../math/Vec2.ts" />
/// <reference path="../../geom/Point.ts" />
/// <reference path="../../math/Vec2Utils.ts" />
/// <reference path="Manager.ts" />
/// <reference path="Body.ts" />
/// <reference path="Shape.ts" />
/// <reference path="ShapePoly.ts" />

/**
* Phaser - Advanced Physics - ShapeTriangle
*
* Based on the work Ju Hyung Lee started in JS PhyRus.
*/

module Phaser.Physics.Advanced {

    export class ShapeTriangle extends Phaser.Physics.Advanced.ShapePoly {

        constructor(p1, p2, p3) {

            super( [ new Phaser.Vec2(p1.x, p1.y), new Phaser.Vec2(p2.x, p2.y), new Phaser.Vec2(p3.x, p3.y) ] );

        }

    }

}
