/// <reference path="../Game.ts" />

/**
* Phaser - IntersectResult
*
* A light-weight result object to hold the results of an intersection. For when you need more than just true/false.
*/

module Phaser {

    export class IntersectResult {

        /**
        * Did they intersect or not?
        * @property result
        * @type Boolean
        */
        result: bool = false;

        /**
        * @property x
        * @type Number
        */
        x: number;

        /**
        * @property y
        * @type Number
        */
        y: number;

        /**
        * @property x1
        * @type Number
        */
        x1: number;

        /**
        * @property y1
        * @type Number
        */
        y1: number;

        /**
        * @property x2
        * @type Number
        */
        x2: number;

        /**
        * @property y2
        * @type Number
        */
        y2: number;

        /**
        * @property width
        * @type Number
        */
        width: number;

        /**
        * @property height
        * @type Number
        */
        height: number;

        /**
        *
        * @method setTo
        * @param {Number} x1
        * @param {Number} y1
        * @param {Number} [x2]
        * @param {Number} [y2]
        * @param {Number} [width]
        * @param {Number} [height]
        */
        setTo(x1: number, y1: number, x2?: number = 0, y2?: number = 0, width?: number = 0, height?: number = 0) {

            this.x = x1;
            this.y = y1;

            this.x1 = x1;
            this.y1 = y1;

            this.x2 = x2;
            this.y2 = y2;

            this.width = width;
            this.height = height;

        }

    }

}
