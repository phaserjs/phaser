/// <reference path="../../math/Vec2.ts" />
/// <reference path="../AdvancedPhysics.ts" />
/// <reference path="../Body.ts" />
/// <reference path="Shape.ts" />
/// <reference path="Poly.ts" />

/**
* Phaser - Advanced Physics - Shapes - Box
*
* Based on the work Ju Hyung Lee started in JS PhyRus.
*/

module Phaser.Physics.Shapes {

    export class Box extends Phaser.Physics.Shapes.Poly {

        //  Give in pixels
        constructor(x, y, width, height) {

            console.log('Box px', x, y, width, height);

            x = Phaser.Physics.AdvancedPhysics.pixelsToMeters(x);
            y = Phaser.Physics.AdvancedPhysics.pixelsToMeters(y);
            width = Phaser.Physics.AdvancedPhysics.pixelsToMeters(width);
            height = Phaser.Physics.AdvancedPhysics.pixelsToMeters(height);

            console.log('Box m', x, y, width, height);

	        var hw = width * 0.5;
	        var hh = height * 0.5;

            console.log('Box hh', hw, hh);

	        super([
                { x: -hw + x, y: +hh + y },
                { x: -hw + x, y: -hh + y },
                { x: +hw + x, y: -hh + y },
                { x: +hw + x, y: +hh + y }
	        ]);

        }

    }

}
