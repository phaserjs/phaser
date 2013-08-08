/// <reference path="../../_definitions.ts" />

/**
* Phaser - Easing - Quadratic
*
* For use with Phaser.Tween
*/

module Phaser.Easing {

    export class Quadratic {

        public static In(k) {

            return k * k;

        }

        public static Out(k) {

            return k * (2 - k);

        }

        public static InOut(k) {

            if ((k *= 2) < 1) return 0.5 * k * k;
            return -0.5 * (--k * (k - 2) - 1);

        }

    }

}
