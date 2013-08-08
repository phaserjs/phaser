/// <reference path="../../_definitions.ts" />

/**
* Phaser - Easing - Circular
*
* For use with Phaser.Tween
*/

module Phaser.Easing {

    export class Circular {

        public static In(k) {

            return 1 - Math.sqrt(1 - k * k);

        }

        public static Out(k) {

            return Math.sqrt(1 - (--k * k));

        }

        public static InOut(k) {

            if ((k *= 2) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1);
            return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

        }

    }

}
