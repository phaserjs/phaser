/// <reference path="../../_definitions.ts" />

/**
* Phaser - Easing - Quartic
*
* For use with Phaser.Tween
*/

module Phaser.Easing {

    export class Quartic {

        public static In(k) {

            return k * k * k * k;

        }

        public static Out(k) {

            return 1 - (--k * k * k * k);

        }

        public static InOut(k) {

            if ((k *= 2) < 1) return 0.5 * k * k * k * k;
            return -0.5 * ((k -= 2) * k * k * k - 2);

        }

    }

}
