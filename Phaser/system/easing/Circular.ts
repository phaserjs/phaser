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
