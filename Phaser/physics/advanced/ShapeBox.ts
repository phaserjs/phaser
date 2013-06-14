/// <reference path="../../math/Vec2.ts" />
/// <reference path="../../geom/Point.ts" />
/// <reference path="../../math/Vec2Utils.ts" />
/// <reference path="Manager.ts" />
/// <reference path="Body.ts" />
/// <reference path="Shape.ts" />
/// <reference path="ShapePoly.ts" />

/**
* Phaser - Advanced Physics - ShapeBox
*
* Based on the work Ju Hyung Lee started in JS PhyRus.
*/

module Phaser.Physics.Advanced {

    export class ShapeBox extends Phaser.Physics.Advanced.ShapePoly {

        constructor(x, y, width, height) {

	        var hw = width * 0.5;
	        var hh = height * 0.5;

	        super([
                new Phaser.Vec2(-hw + x, +hh + y),
                new Phaser.Vec2(-hw + x, -hh + y),
                new Phaser.Vec2(+hw + x, -hh + y),
                new Phaser.Vec2(+hw + x, +hh + y)
	        ]);

        }

    }

}
