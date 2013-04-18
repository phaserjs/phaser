/// <reference path="../../Game.ts" />

/**
 *	Phaser - Easing
 *
 *	@desc 		Based heavily on tween.js by sole (https://github.com/sole/tween.js)
 *
 *	@version 	1.0 - 11th January 2013
 *
 *	@author 	Richard Davey, TypeScript conversion and Phaser integration. See Phaser.TweenManager for the full tween.js author list
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
