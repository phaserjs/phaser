/// <reference path="../../Game.ts" />

/**
* Phaser - Easing - Sinusoidal
*
* For use with Phaser.Tween
*/

module Phaser.Easing {

    export class Sinusoidal {

        public static In(k) {

            return 1 - Math.cos(k * Math.PI / 2);

        }

        public static Out(k) {

            return Math.sin(k * Math.PI / 2);

        }

        public static InOut(k) {

            return 0.5 * (1 - Math.cos(Math.PI * k));

        }

    }

}
