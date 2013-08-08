/// <reference path="../../_definitions.ts" />

/**
* Phaser - Easing - Back
*
* For use with Phaser.Tween
*/

module Phaser.Easing {

    export class Back {

        public static In(k) {

            var s = 1.70158;
            return k * k * ((s + 1) * k - s);

        }

        public static Out(k) {

            var s = 1.70158;
            return --k * k * ((s + 1) * k + s) + 1;

        }

        public static InOut(k) {

            var s = 1.70158 * 1.525;
            if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
            return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

        }

    }

}
