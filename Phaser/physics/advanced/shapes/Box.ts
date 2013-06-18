/// <reference path="../../../math/Vec2.ts" />
/// <reference path="../Manager.ts" />
/// <reference path="../Body.ts" />
/// <reference path="Shape.ts" />
/// <reference path="Poly.ts" />

/**
* Phaser - Advanced Physics - Shapes - Box
*
* Based on the work Ju Hyung Lee started in JS PhyRus.
*/

module Phaser.Physics.Advanced.Shapes {

    export class Box extends Phaser.Physics.Advanced.Shapes.Poly {

        //  Give in pixels
        constructor(x, y, width, height) {

            x = Manager.pixelsToMeters(x);
            y = Manager.pixelsToMeters(y);
            width = Manager.pixelsToMeters(width);
            height = Manager.pixelsToMeters(height);

	        var hw = width * 0.5;
	        var hh = height * 0.5;

	        super([
                { x: -hw + x, y: +hh + y },
                { x: -hw + x, y: -hh + y },
                { x: +hw + x, y: -hh + y },
                { x: +hw + x, y: +hh + y }
	        ]);

        }

    }

}
