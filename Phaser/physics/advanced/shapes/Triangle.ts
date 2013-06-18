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

        constructor(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {

            x1 = Manager.pixelsToMeters(x1);
            y1 = Manager.pixelsToMeters(y1);
            x2 = Manager.pixelsToMeters(x2);
            y2 = Manager.pixelsToMeters(y2);
            x3 = Manager.pixelsToMeters(x3);
            y3 = Manager.pixelsToMeters(y3);

            super([{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }]);

        }

    }

}
