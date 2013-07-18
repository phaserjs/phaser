/// <reference path="../../Game.ts" />

/**
* Phaser - Easing - Exponential
*
* For use with Phaser.Tween
*/

module Phaser.Easing {

    export class Exponential {

        public static In(k) {

            return k === 0 ? 0 : Math.pow(1024, k - 1);

        }

        public static Out(k) {

            return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);

        }

        public static InOut(k) {

            if (k === 0) return 0;
            if (k === 1) return 1;
            if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
            return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);

        }

    }

}
